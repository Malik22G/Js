import { Token, exchangeMagic } from "@/lib/api/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (key === null) {
    return NextResponse.redirect(request.headers.get("Host") ?? "");
  }

  let token: Token;

  try {
    token = await exchangeMagic({ key });
  } catch (_) {
    const res = new NextResponse(`\
<script>window.location.href = "/?key=${encodeURIComponent(key)}";</script>
<noscript><a href="/?key=${encodeURIComponent(key)}">click here</a></noscript>
`);
    res.headers.set("Content-Type", "text/html");
    return res;
  }
  
  const res = new NextResponse(`\
<script>window.location.href = "/";</script>
<noscript><a href="/">click here</a></noscript>`);

  res.headers.set("Content-Type", "text/html");

  const opts = {
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NEERY_ENV === "production",
  };

  res.cookies.set({
    name: "auth",
    value: JSON.stringify({ token: token.token, user: token.owner }),
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 50)),
    ...opts,
  });

  return res;
}
