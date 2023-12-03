"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Customer, patchCustomer, CustomerPatch } from "@/lib/api/customers";
import { ReactNode, useContext } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "../../components/UnderTierBadge";

export type EditCustomerModalData = {
  poiid: string;
  data: {
    uuid: string;
    name?: string;
    comment?: string;
  };
};

export function customerToData(
  poiid: string,
  customer: Customer
): EditCustomerModalData {
  return {
    poiid,
    data: {
      uuid: customer.uuid,
      name: customer.name,
      comment: customer.comment,
    },
  };
}

export const EditCustomerModalContext =
  createModalContext<EditCustomerModalData>();

function EditCustomerModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  let ctx = useContext(EditCustomerModalContext);
  let d: EditCustomerModalData = ctx.data ?? { poiid: "", data: { uuid: "" } };

  return (
    <>
      <ModalTitle context={EditCustomerModalContext}>
        Vendég módosítása
      </ModalTitle>

      <InputContainer>
        <InputLabel>Név</InputLabel>

        <span>{d.data.name ?? d.data.uuid}</span>
      </InputContainer>

      <InputContainer>
        <InputLabel>Leírás</InputLabel>

        <Input
          className="w-full ml-[12px]"
          value={d.data.comment ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                comment: e.target.value,
              },
            })
          }
          bare
        />
      </InputContainer>
      <ModalError context={EditCustomerModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          palette="secondary"
          className="mt-[8px]"
          action={async () => {
            let body: CustomerPatch = {
              comment: d.data.comment ? (d.data.comment.trim().length > 0 ? d.data.comment : undefined) : undefined,
            };

            await errorHandler(
              patchCustomer(d.poiid, d.data.uuid, body),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          Módosítás
        </LoadingButton>
      ) : (
        <UnderTierBadge
          place={place}
        />
      )}
      
    </>
  );
}

export default function EditCustomerModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<EditCustomerModalData>
      context={EditCustomerModalContext}
      siblings={children}
    >
      <EditCustomerModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
