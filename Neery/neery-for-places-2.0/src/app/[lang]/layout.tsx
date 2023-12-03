import { dir } from "i18next";
import { Language } from "./i18n/settings";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/server";
import { GoogleAuthProvider } from "./googleauth";
import PostHog from "./posthog";
import { loadAndUseTranslation } from "./i18n";

export default async function PrepLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode,
  params: { lang: Language },
}) {
  loadAndUseTranslation(lang, "translation");
  
  return (
    <html lang={lang} dir={dir(lang)}>
      <body>
        <PostHog>
          <GoogleAuthProvider>
            {/* @ts-expect-error: async component */}
            <AuthProvider>
              {children}
            </AuthProvider>
          </GoogleAuthProvider>
        </PostHog>
      </body>
    </html>
  );
}
