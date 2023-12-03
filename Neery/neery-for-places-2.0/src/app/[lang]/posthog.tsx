"use client";

import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect } from "react";

if (globalThis.window !== undefined &&  process.env.NEXT_PUBLIC_POSTHOG_KEY !== undefined) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "https://eu.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NEXT_PUBLIC_NEERY_ENV !== "production") posthog.debug();
    },
  });
}

export default function PostHog({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    posthog?.capture("$pageview");
  }, [pathname]);

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
}
