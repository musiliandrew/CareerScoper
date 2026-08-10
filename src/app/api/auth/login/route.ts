import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const djangoApi = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://careerscope-backend-786345663105.us-central1.run.app/api";
    
    const djangoRes = await fetch(`${djangoApi}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!djangoRes.ok) {
      let errorData = {};
      try { errorData = await djangoRes.json(); } catch(e) {}
      return NextResponse.json(errorData, { status: djangoRes.status });
    }

    const data = await djangoRes.json();
    const response = NextResponse.json({ success: true });

    // Store tokens securely in HttpOnly cookies
    if (data.access) {
      response.cookies.set({
        name: "access_token",
        value: data.access,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    if (data.refresh) {
      response.cookies.set({
        name: "refresh_token",
        value: data.refresh,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
