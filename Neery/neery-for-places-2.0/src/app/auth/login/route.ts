import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  if (
    typeof data !== "object"
    || data === null
    || typeof data.token !== "string"
    || typeof data.user !== "string"
  ) {
    return NextResponse.json({ err: "BAD_REQUEST" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const opts = {
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NEERY_ENV === "production",
  };

  res.cookies.set({
    name: "auth",
    value: JSON.stringify({token: data.token, user: data.user}),
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 50)),
    ...opts,
  });

  return res;
}
