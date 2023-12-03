"use client";

import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import { Zone, deleteZone } from "@/lib/api/zones";
import { ReactNode, useContext } from "react";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "./UnderTierBadge";

export type ZoneDeleteModalData = Zone;
export const ZoneDeleteModalContext = createModalContext<ZoneDeleteModalData>();

function ZoneDeleteModalInside({
  onChange,
  place,
}: {
  onChange(): void,
  place: Place,
}) {
  let ctx = useContext(ZoneDeleteModalContext);

  return (
    <>
      <ModalTitle context={ZoneDeleteModalContext}>Asztal törlése</ModalTitle>

      <p>
        Biztosan törlöd a &quot;{ctx.data?.name}&quot; című, {ctx.data?.count}{" "}
        férőhelyű asztalt? Ez a művelet visszavonhatatlan, és az asztalon lévő
        foglalások törlődnek.
      </p>
      <ModalError context={ZoneDeleteModalContext} />

      {place.tier >= 1 ? (
        <LoadingButton
          palette="red"
          className="mt-[8px]"
          action={async () => {
            if (ctx.data === null) return;

            await errorHandler(
              deleteZone(ctx.data.poiid, ctx.data.uuid),
              ctx.setError
            );

            onChange();
            ctx.update(null);
            await atime(250);
          }}
        >
          Törlés
        </LoadingButton>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ZoneDeleteModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode,
  onChange(): void,
  place: Place,
}) {
  return (
    <ModalBox<ZoneDeleteModalData>
      context={ZoneDeleteModalContext}
      siblings={children}
    >
      <ZoneDeleteModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
