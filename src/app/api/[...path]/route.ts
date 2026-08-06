import { NextRequest, NextResponse } from "next/server";

const DJANGO_BACKEND = "https://careerscope-backend-786345663105.us-central1.run.app";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path ? resolvedParams.path.join("/") : "";
  const query = request.nextUrl.search;
  
  // Ensure trailing slash for Django REST endpoints
  const pathWithSlash = path ? (path.endsWith("/") ? path : `${path}/`) : "";
  const targetUrl = `${DJANGO_BACKEND}/api/${pathWithSlash}${query}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body = request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined;

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "follow",
    });

    const responseText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    const responseHeaders = new Headers();
    const contentType = res.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("Set-Cookie", setCookie);
    }

    if (typeof responseData === "string") {
      return new NextResponse(responseData, {
        status: res.status,
        headers: responseHeaders,
      });
    }

    return NextResponse.json(responseData, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Proxy request failed" }, { status: 500 });
  }
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
