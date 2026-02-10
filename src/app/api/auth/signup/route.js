import { NextResponse } from "next/server";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function POST(request) {
  try {
    const payload = await request.json();

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => "");
      if (text) {
        data = { message: text.slice(0, 200) };
      }
    }

    if (!response.ok && response.status >= 500) {
      return NextResponse.json(
        {
          message:
            "Auth service is temporarily unavailable. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data ?? {}, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
