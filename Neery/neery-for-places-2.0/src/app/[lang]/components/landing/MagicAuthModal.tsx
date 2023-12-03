"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { ReactNode, useContext } from "react";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import LoadingButton from "@/components/ui/LoadingButton";
import { sendMagic } from "@/lib/api/auth";
import { useTranslation } from "../../i18n/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

export type MagicAuthModalData = {
  email: string;
  sent?: true;
}

export const MagicAuthModalContext = createModalContext<MagicAuthModalData>();

function MagicAuthModalInside() {
  const ctx = useContext(MagicAuthModalContext);
  const { i18n, t } = useTranslation("landing/auth");

  if (ctx.data?.sent) {
    return (
      <>
        <ModalTitle context={MagicAuthModalContext}>
          {t("magicSent")}
        </ModalTitle>

        <p>{t("checkInbox")}</p>

        <Button
          palette="secondary"
          action={"http://" + ctx.data.email.split("@")[1]}
        >
          {t("openInbox")}
        </Button>
      </>
    );
  }

  return (
    <>
      <ModalTitle context={MagicAuthModalContext}>
        {t("loginSignup")}
      </ModalTitle>

      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder={t("email_ph")}
        value={ctx.data?.email ?? ""}
        onChange={async e => ctx.data ? ctx.update({
          ...ctx.data,
          email: e.target.value,
        }) : null}
      />

      <LoadingButton
        palette="secondary"
        className="mt-[8px]"
        disabled={!(ctx.data?.email ?? "").match(emailRegex)}
        action={async () => {
          if (ctx.data) {
            await sendMagic({
              email: ctx.data.email,
              lang: i18n.language as ("en" | "hu"),
            });

            ctx.update({
              ...ctx.data,
              sent: true,
            });
          }
        }}
      >
        {t("magicSend")}
      </LoadingButton>
    </>
  );
}

export default function MagicAuthModal({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <ModalBox<MagicAuthModalData>
      context={MagicAuthModalContext}
      siblings={children}
      fixed
    >
      <MagicAuthModalInside />
    </ModalBox>
  );
}
