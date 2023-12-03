import { cookies } from "next/headers";
import { ReactNode } from "react";

import { AuthContextType, _AuthProvider } from "./client";
import { getUser } from "../api/users";

type AuthCookie = {
  token: string,
  user: string,
}

export async function useAuth(): Promise<AuthContextType> {
  const cookieStore = cookies();
  const data: AuthCookie | null
    = JSON.parse(cookieStore.get("auth")?.value ?? "null");
  
  return {
    token: data?.token ?? null,
    user: data ? (await getUser(data.user)) : null,
  };
}

export async function AuthProvider({ children }: { children: ReactNode }) {
  const data = await useAuth();

  return (
    <_AuthProvider ctx={data}>
      {children}
    </_AuthProvider>
  );
}
