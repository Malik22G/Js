"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="967601156077-fmln04jgp3ri25e60c2dkksb9d5bvbco.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
