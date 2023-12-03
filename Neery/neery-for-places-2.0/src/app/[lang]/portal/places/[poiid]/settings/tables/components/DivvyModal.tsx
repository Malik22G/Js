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
import { Divvy, DivvyPost, patchDivvy, postDivvy } from "@/lib/api/divvies";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "../../../components/UnderTierBadge";

export type DivvyModalData = {
  uuid?: string;
  poiid: string;
  data: Partial<DivvyPost>;
};

export function divvyToData({ uuid, poiid, ...data }: Divvy): DivvyModalData {
  return {
    uuid,
    poiid,
    data,
  };
}

export const DivvyModalContext = createModalContext<DivvyModalData>();

function DivvyModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  let ctx = useContext(DivvyModalContext);
  let d: DivvyModalData = ctx.data ?? { poiid: "", data: {} };
  const { t } = useTranslation("portal/settings/tables");

  return (
    <>
      <ModalTitle context={DivvyModalContext}>
        {ctx.data?.uuid ? t("modifyGroup") : t("createGroup")}
      </ModalTitle>

      <InputContainer>
        <InputLabel>{t("name")}</InputLabel>

        <Input
          className="w-1/2"
          value={d.data.name ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: { ...d.data, name: e.target.value },
            })
          }
          bare
        />
      </InputContainer>
      <ModalError context={DivvyModalContext} />
      {place.tier >= 1 ? (
        <LoadingButton
          palette="secondary"
          className="mt-[8px]"
          disabled={d.data.name === undefined || d.data.name.trim().length === 0}
          action={async () => {
            let body: DivvyPost = {
              name: d.data.name ?? "",
            };

            if (d.uuid !== undefined) {
              await errorHandler(patchDivvy(d.poiid, d.uuid, body), ctx.setError);
            } else {
              await errorHandler(postDivvy(d.poiid, body), ctx.setError);
            }

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          {d.uuid !== undefined ? t("modify") : t("create")}
        </LoadingButton>
      ) : (
        <UnderTierBadge
          place={place}
        />
      )}
    </>
  );
}

export default function DivvyModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<DivvyModalData>
      context={DivvyModalContext}
      siblings={children}
    >
      <DivvyModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
