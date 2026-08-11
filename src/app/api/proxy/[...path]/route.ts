import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

async function handleProxy(req: NextRequest, pathArray: string[]) {
  const djangoApi = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://careerscope-backend-786345663105.us-central1.run.app/api";
  const rawPath = pathArray.join("/").replace(/\/+$/, "");
  const targetUrl = `${djangoApi.replace(/\/+$/, "")}/${rawPath}/` + req.nextUrl.search;

  const accessToken = req.cookies.get("access_token")?.value;
  const clientAuth = req.headers.get("authorization");

  const headers = new Headers();
  
  // Forward safe headers
  const reqHeaders = Object.fromEntries(req.headers.entries());
  if (reqHeaders["content-type"]) {
    headers.set("content-type", reqHeaders["content-type"]);
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  } else if (clientAuth) {
    headers.set("Authorization", clientAuth);
  }

  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      // Pass the raw body through
      body = await req.arrayBuffer();
    } catch (e) {}
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // Need to avoid caching dynamic proxy requests
      cache: "no-store", 
    });

    const data = await res.arrayBuffer();

    const responseHeaders = new Headers();
    const contentType = res.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Proxy Error" }, { status: 500 });
  }
}
