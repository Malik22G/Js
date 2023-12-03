import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const referer = request.nextUrl.searchParams.get("referer");

  const res = NextResponse.json({ ok: true });

  if (referer === null) {
    res.cookies.set({
      name: "neery_referer",
      value: "",
      maxAge: 0,
      path: "/",
    });
  } else if (!referer.includes(".neery.net/")) {
    res.cookies.set("neery_referer", referer, {
      maxAge: 3600,
      path: "/",
    });
  }

  return res;
}
