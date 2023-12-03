"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { ReactNode, useContext } from "react";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { LandingContext } from "../../client";
import Button from "@/components/ui/Button";
import { MagicAuthModalContext } from "./MagicAuthModal";
import { useTranslation } from "../../i18n/client";

export const AuthModalContext = createModalContext<true>();

function AuthModalInside() {
  const ctx = useContext(AuthModalContext);
  const lCtx = useContext(LandingContext);
  const maCtx = useContext(MagicAuthModalContext);
  const { t } = useTranslation("landing/auth");

  return (
    <>
      <ModalTitle context={AuthModalContext}>
        {t("loginSignup")}
      </ModalTitle>

      <Button
        palette="red"
        action={lCtx.login}
      >
        Google
      </Button>

      <Button
        palette="secondary"
        action={() => {
          ctx.update(null);
          maCtx.update({ email: "" });
        }}
      >
        E-mail
      </Button>

      <Button
        palette="tertiary"
        size="small"
        action="https://meetings-eu1.hubspot.com/csongor-melegh"
      >
        {t("demo")}
      </Button>
    </>
  );
}

export default function AuthModal({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <ModalBox<true>
      context={AuthModalContext}
      siblings={children}
      fixed
      onHide={() => {
        if (window.location.hash === "#AUTH") {
          window.location.hash = "";
        }
      }}
    >
      <AuthModalInside />
    </ModalBox>
  );
}
