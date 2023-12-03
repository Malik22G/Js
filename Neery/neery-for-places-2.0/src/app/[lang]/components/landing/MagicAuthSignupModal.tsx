"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { ReactNode, useContext } from "react";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import LoadingButton from "@/components/ui/LoadingButton";
import { signupMagic } from "@/lib/api/auth";
import { useTranslation } from "../../i18n/client";
import Input from "@/components/ui/Input";
import { logIn } from "@/lib/api/local";
import { useRouter } from "next/navigation";

export type MagicAuthSignupModalData = {
  key: string;
  name: string;
}

export const MagicAuthSignupModalContext = createModalContext<MagicAuthSignupModalData>();

function MagicAuthSignupModalInside() {
  const router = useRouter();
  const ctx = useContext(MagicAuthSignupModalContext);
  const { t } = useTranslation("landing/auth");

  return (
    <>
      <ModalTitle context={MagicAuthSignupModalContext}>
        {t("signupTitle")}
      </ModalTitle>

      <Input
        label={t("name")}
        autoComplete="name"
        placeholder={t("name_ph")}
        value={ctx.data?.name ?? ""}
        onChange={async e => ctx.data ? ctx.update({
          ...ctx.data,
          name: e.target.value,
        }) : null}
      />

      <LoadingButton
        palette="secondary"
        className="mt-[8px]"
        disabled={(ctx.data?.name ?? "").trim().length === 0}
        action={async () => {
          if (ctx.data) {
            const token = await signupMagic({
              key: ctx.data.key,
              name: ctx.data.name,
            });

            await logIn(token);

            ctx.update(null);

            router.refresh();
          }
        }}
      >
        {t("signup")}
      </LoadingButton>
    </>
  );
}

export default function MagicAuthSignupModal({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <ModalBox<MagicAuthSignupModalData>
      context={MagicAuthSignupModalContext}
      siblings={children}
      fixed
    >
      <MagicAuthSignupModalInside />
    </ModalBox>
  );
}
