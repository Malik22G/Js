
import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLang, languages } from "./app/[lang]/i18n/settings";

acceptLanguage.languages(languages);

function isPathProtected(path: string) {
  return languages.some(lang => path.startsWith(`/${lang}/portal`));
}

export async function middleware(req: NextRequest) {
  const lang = acceptLanguage.get(req.cookies.get("i18next")?.value ?? req.headers.get("Accept-Language"))
    || fallbackLang;
  
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`))
    && !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url));
  }

  if (
    typeof globalThis.window === "undefined"
    && isPathProtected(req.nextUrl.pathname)
    && !req.cookies.get("auth")) {
    return NextResponse.redirect(new URL(`/${lang}`, req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-path", req.nextUrl.pathname);

  const rObj = { request: { headers } };

  const referer = req.headers.get("referer");
  if (referer !== null) {
    const refererUrl = new URL(referer);
    const langInReferer = languages.find(lang => refererUrl.pathname.startsWith(`/${lang}`));
    const response = NextResponse.next(rObj);
    if (langInReferer) response.cookies.set("i18next", langInReferer);
    return response;
  }

  return NextResponse.next(rObj);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|auth|sounds).*)"],
};
