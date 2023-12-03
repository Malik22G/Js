"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { User } from "../api/users";

export type AuthContextType = {
  token: string | null,
  user: User | null,
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function _AuthProvider({ ctx, children }: { ctx: AuthContextType, children: ReactNode }) {
  useEffect(() => {
    if (typeof globalThis.window === "object") {
      // HACK: this sucks. - MG
      (globalThis.window as any).neeryAuth = ctx;
    }
  }, [ctx]);

  return (
    <AuthContext.Provider
      value={ctx}
    >
      {children}
    </AuthContext.Provider>
  );
}
