"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { ReactNode, useContext } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import Select from "@/components/ui/Select";
import {
  Access,
  AccessPatch,
  AccessPost,
  AccessRole,
  accessRoles,
  createAccess,
  patchAccess,
} from "@/lib/api/access";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { User } from "@/lib/api/users";
import ModalError from "@/components/ui/Modal/ModalError";

export type CreateAccessModalData = {
  poiid: string;
  user?: User;
  email?: string;
  role?: AccessRole;
};

export const CreateAccessModalContext =
  createModalContext<CreateAccessModalData>();

function CreateAccessModalInside({
  onChange,
  access,
}: {
  onChange(): void;
  access: Access;
}) {
  const { t } = useTranslation("portal/settings/access");
  let ctx = useContext(CreateAccessModalContext);
  let d: CreateAccessModalData = ctx.data ?? { poiid: "" };

  return (
    <>
      <ModalTitle context={CreateAccessModalContext}>
        {d.user !== undefined ? t("modifyAccess") : t("inviteUser")}
      </ModalTitle>

      {d.user === undefined ? (
        <p className="text-[14px]">{t("inviteInfo")}</p>
      ) : null}

      {d.user === undefined ? (
        <InputContainer>
          <InputLabel>{t("email")}</InputLabel>

          <Input
            className="w-1/2"
            value={d.email ?? ""}
            onChange={(e) =>
              ctx.update({
                ...d,
                email: e.target.value,
              })
            }
            bare
          />
        </InputContainer>
      ) : (
        <InputContainer>
          <InputLabel>{t("user")}</InputLabel>

          <div className="flex gap-[8px] items-center">
            {/* eslint-disable @next/next/no-img-element */}
            {d.user.picture ? (
              <img
                className="w-[32px] h-[32px] object-cover rounded-full"
                src={"data:image/jpeg;base64," + d.user.picture}
                alt={d.user.name ?? "profile pic"}
              />
            ) : null}
            {/* eslint-enable @next/next/no-img-element */}
            <span>{d.user.name ?? d.user.uuid}</span>
          </div>
        </InputContainer>
      )}

      <InputContainer>
        <InputLabel>{t("role")}</InputLabel>

        <Select<AccessRole | undefined>
          value={d.role}
          values={accessRoles
            .filter((_, i) => i <= accessRoles.indexOf(access.role))
            .map((x) => [x, t(("accessRole." + x) as any)])}
          setValue={(role) =>
            ctx.update({
              ...d,
              role,
            })
          }
        />
      </InputContainer>

      <ModalError context={CreateAccessModalContext} />

      <LoadingButton
        palette="secondary"
        className="mt-[8px]"
        disabled={
          (d.user === undefined
            ? d.email === undefined || d.email.length === 0
            : false) || d.role === undefined
        }
        action={async () => {
          if (d.user !== undefined) {
            let body: AccessPatch = {
              userId: d.user.uuid,
              role: d.role ?? "WAITER",
            };

            try {
              await patchAccess(d.poiid, body);
            } catch (e) {
              ctx.setError(t("error"));
              throw e;
            }
          } else {
            let body: AccessPost = {
              email: d.email ?? "",
              role: d.role ?? "WAITER",
            };

            try {
              await createAccess(d.poiid, body);
            } catch (e) {
              let err: any = e;
              if (typeof e === "string") {
                try {
                  err = JSON.parse(e);
                } catch (_) {}
              }

              if (err?.body?.err === "USER_NOT_FOUND") {
                ctx.setError(t("userNotFound"));
                return;
              } else {
                ctx.setError(t("error"));
                throw e;
              }
            }
          }

          onChange();
          ctx.update(null);
          await atime(250);
        }}
      >
        {d.user !== undefined ? t("modify") : t("invite")}
      </LoadingButton>
    </>
  );
}

export default function CreateAccessModal({
  children,
  access,
  onChange,
}: {
  children: ReactNode;
  access: Access;
  onChange(): void;
}) {
  return (
    <ModalBox<CreateAccessModalData>
      context={CreateAccessModalContext}
      siblings={children}
    >
      <CreateAccessModalInside access={access} onChange={onChange} />
    </ModalBox>
  );
}
