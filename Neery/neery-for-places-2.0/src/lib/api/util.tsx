import { i18n } from "i18next";

const API_ROOT =
  process.env.NEXT_PUBLIC_NEERY_ENV === "production"
    ? "https://khronos.neery.net"
    : "https://khronos.staging.neery.net";
// : "http://localhost:8080";

export interface FetchOptions {
  emailKey?: string;
  token?: string;
  data?: unknown;
  method?: string;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export function resolveI18n(
  dict: Record<string, string> | undefined,
  lang: string | i18n
): string | undefined {
  if (dict === undefined) return undefined;

  return (
    dict[typeof lang === "string" ? lang : lang.language] ||
    dict["en"] ||
    Object.values(dict)[0]
  );
}

async function getToken(): Promise<string | null> {
  if (typeof globalThis.window === "object") {
    const neeryAuth = (globalThis.window as any).neeryAuth;
    if (neeryAuth) {
      return neeryAuth.token;
    } else {
      return null;
    }
  } else {
    const cookieStore = (await import("next/headers")).cookies();
    const auth = cookieStore.get("auth");
    if (auth !== undefined) {
      return JSON.parse(auth.value)?.token ?? null;
    } else {
      return null;
    }
  }
}

export async function _fetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = options.token ?? (await getToken());

  const headers: HeadersInit = {};

  if (options.emailKey !== undefined) {
    headers["Authorization"] = `EmailToken ${options.emailKey}`;
  } else if (token !== null) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.method === undefined) {
    if (options.data !== undefined && options.data !== null) {
      options.method = "POST";
    } else {
      options.method = "GET";
    }
  }

  let body: BodyInit | undefined = undefined;

  if (options.data !== undefined && options.data !== null) {
    if (options.data instanceof FormData) {
      body = options.data;
    } else {
      headers["Content-Type"] = "application/json";
      body =
        typeof options.data === "string"
          ? options.data
          : JSON.stringify(options.data);
    }
  }

  const req = await fetch(API_ROOT + path, {
    method: options.method,
    headers,
    body,
    cache: options.cache ?? "no-cache",
    next: options.next,
  });

  if (req.status >= 400) {
    const err = {
      status: req.status,
      body: await req.text(),
    };

    try {
      err.body = JSON.parse(err.body);
    } catch (e) {}

    throw JSON.stringify(err);
  }

  return await req.json();
}
