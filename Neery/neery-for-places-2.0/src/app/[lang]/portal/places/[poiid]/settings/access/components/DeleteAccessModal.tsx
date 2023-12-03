"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { Access, deleteAccess } from "@/lib/api/access";
import { PlaceOrID } from "@/lib/api/places";
import { User } from "@/lib/api/users";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";

export type DeleteAccessModalData = {
  poiid: PlaceOrID;
  access: Access;
  user: User;
};

export const DeleteAccessModalContext =
  createModalContext<DeleteAccessModalData>();

function DeleteAccessModalInside({ onChange }: { onChange(): void }) {
  const ctx = useContext(DeleteAccessModalContext);

  return (
    <>
      <ModalTitle context={DeleteAccessModalContext}>
        Hozzáférés törlése
      </ModalTitle>

      <p>
        Biztosan törlöd {ctx.data?.user.name ?? ctx.data?.user.uuid ?? null}{" "}
        hozzáférését? Ez a művelet visszavonhatatlan.
      </p>
      <ModalError context={DeleteAccessModalContext} />
      <LoadingButton
        palette="red"
        className="mt-[8px]"
        action={async () => {
          if (ctx.data === null) return;

          await errorHandler(
            deleteAccess(ctx.data.poiid, {
              userId: ctx.data.access.userId,
            }),
            ctx.setError
          );

          onChange();
          ctx.update(null);
          await atime(250);
        }}
      >
        Törlés
      </LoadingButton>
    </>
  );
}

export default function DeleteAccessModal({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange(): void;
}) {
  return (
    <ModalBox<DeleteAccessModalData>
      context={DeleteAccessModalContext}
      siblings={children}
    >
      <DeleteAccessModalInside onChange={onChange} />
    </ModalBox>
  );
}
