import { FetchOptions, _fetch } from "./util";

export type Token = {
  token: string,
  owner: string,
};

export type AuthGoogleData = {
  id_token?: string,
  access_token: string,
};

export async function authGoogle(data: AuthGoogleData, options?: FetchOptions): Promise<Token> {
  return await _fetch("/auth/google", {
    method: "POST",
    data,
    ...options,
  });
}

export type MagicAuthSend = {
  email: string,
  lang: "en" | "hu",
}

export async function sendMagic(data: MagicAuthSend, options?: FetchOptions): Promise<{ok: true}> {
  return await _fetch("/auth/magic/send", {
    method: "POST",
    data,
    ...options,
  });
}

export type MagicAuthExchange = {
  key: string,
}

export async function exchangeMagic(data: MagicAuthExchange, options?: FetchOptions): Promise<Token> {
  return await _fetch("/auth/magic/exchange", {
    method: "POST",
    data,
    ...options,
  });
}

export type MagicAuthSignup = {
  key: string,
  name: string,
}

export async function signupMagic(data: MagicAuthSignup, options?: FetchOptions): Promise<Token> {
  return await _fetch("/auth/magic/signup", {
    method: "POST",
    data,
    ...options,
  });
}
