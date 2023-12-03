"use client";

import { createContext, useContext, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { authGoogle } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/client";
import { useGoogleLogin } from "@react-oauth/google";
import { logIn, logOut } from "@/lib/api/local";
import AuthModal, { AuthModalContext } from "./components/landing/AuthModal";
import MagicAuthModal from "./components/landing/MagicAuthModal";
import MagicAuthSignupModal, { MagicAuthSignupModalContext } from "./components/landing/MagicAuthSignupModal";
import OnboardingModal from "./components/onboarding/OnboardingModal";

type LandingContextType = {
  login: () => void;
  startOnboard: () => void;
};

export const LandingContext = createContext<LandingContextType>(
  {} as LandingContextType
);

export function _LoginBtn() {
  const ctx = useContext(AuthModalContext);

  return (
    <Button palette="secondary" action={() => ctx.update(true)}>
      Bejelentkezés
    </Button>
  );
}

export function _StartOnboardBtn({ className }: { className?: string }) {
  const ctx = useContext(AuthModalContext);

  return (
    <Button
      palette="secondary"
      className={className ?? "mt-8 mx-auto block"}
      action={() => ctx.update(true)}
    >
      Kezdd el
    </Button>
  );
}

function KeySignupTrigger({ magicKey }: { magicKey: string | null }) {
  const msCtx = useContext(MagicAuthSignupModalContext);

  useEffect(() => {
    if (magicKey !== null && magicKey !== msCtx.data?.key) {
      msCtx.update({
        key: magicKey,
        name: "",
      });
    }
  }, [magicKey, msCtx]);

  return null;
}

export default function _LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const search = useSearchParams();

  const router = useRouter();
  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read",
    onSuccess: async (res) => {
      const token = await authGoogle({
        access_token: res.access_token,
      });

      await logIn(token);
      router.refresh();
    },
  });

  const register = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read",
    onSuccess: async (res) => {
      const token = await authGoogle({
        access_token: res.access_token,
      });

      await logIn(token);
      router.push("/portal/create");
    },
  });

  function startOnboard() {
    register();
  }

  if (auth.user) {
    return (
      <main className="w-full h-full flex flex-col items-center justify-center gap-[16px]">
        <p>{auth.user.name}</p>
        <Button palette="secondary" action="/portal/places">
          My places
        </Button>
        <Button
          palette="secondary"
          action={async () => {
            await logOut();
            router.refresh();
          }}
        >
          Log out
        </Button>
      </main>
    );
  }

  return (
    <LandingContext.Provider value={{ login, startOnboard }}>
      <OnboardingModal>
        <MagicAuthSignupModal>
          <MagicAuthModal>
            <AuthModal>
              <KeySignupTrigger magicKey={search.get("key")} />
              {children}
            </AuthModal>
          </MagicAuthModal>
        </MagicAuthSignupModal>
      </OnboardingModal>
    </LandingContext.Provider>
  );
}
