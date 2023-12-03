"use client";

import IconButton, { IconButtonButtonProps } from "@/components/ui/IconButton";
import { Zone } from "@/lib/api/zones";
import { ReactNode, useContext, useEffect } from "react";
import ZoneModal, {
  ZoneModalContext,
  zoneToData,
} from "../../components/ZoneModal";
import { Pen, X } from "@/components/ui/icons";
import ZoneDeleteModal, {
  ZoneDeleteModalContext,
} from "../../components/ZoneDeleteModal";
import { useRouter } from "next/navigation";
import Button, { ButtonButtonProps } from "@/components/ui/Button";
import { Place, PlaceOrID, placeToID } from "@/lib/api/places";
import { Divvy } from "@/lib/api/divvies";
import DivvyModal, {
  DivvyModalContext,
  divvyToData,
} from "./components/DivvyModal";
import DeleteDivvyModal, {
  DeleteDivvyModalContext,
} from "./components/DeleteDivvyModal";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function _ZoneModal({
  divvies,
  children,
  place,
}: {
  divvies: Divvy[];
  children: ReactNode;
  place: Place;
}) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <ZoneModal
      divvies={divvies}
      onChange={() => router.refresh()}
      place={place}
    >
      {children}
    </ZoneModal>
  );
}

export function _CreateZoneButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const ctx = useContext(ZoneModalContext);

  return (
    <Button
      action={() => ctx.update({ poiid: placeToID(place), data: {} })}
      {...props}
    >
      {children}
    </Button>
  );
}

export function _EditZoneButton({
  divvy,
  zone,
  ...props
}: Omit<IconButtonButtonProps, "action" | "icon"> & {
  divvy?: Divvy;
  zone: Zone;
}) {
  const ctx = useContext(ZoneModalContext);

  return (
    <IconButton
      icon={Pen}
      action={() => ctx.update(zoneToData(zone, divvy))}
      {...props}
    />
  );
}

export function _ZoneDeleteModal({
  children,
  place,
}: {
  children: ReactNode;
  place: Place;
}) {
  const router = useRouter();

  return (
    <ZoneDeleteModal onChange={() => router.refresh()} place={place}>
      {children}
    </ZoneDeleteModal>
  );
}

export function _DeleteZoneButton({
  zone,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  zone: Zone;
}) {
  const ctx = useContext(ZoneDeleteModalContext);

  return <IconButton icon={X} action={() => ctx.update(zone)} {...props} />;
}

export function _DivvyModal({
  children,
  place,
}: {
  children: ReactNode;
  place: Place;
}) {
  const router = useRouter();

  return (
    <DivvyModal onChange={() => router.refresh()} place={place}>
      {children}
    </DivvyModal>
  );
}

export function _CreateDivvyButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const ctx = useContext(DivvyModalContext);

  return (
    <Button
      action={() => ctx.update({ poiid: placeToID(place), data: {} })}
      {...props}
    >
      {children}
    </Button>
  );
}

export function _EditDivvyButton({
  divvy,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  divvy: Divvy;
}) {
  const ctx = useContext(DivvyModalContext);

  return (
    <IconButton
      icon={Pen}
      action={() => ctx.update(divvyToData(divvy))}
      {...props}
    />
  );
}

export function _DeleteDivvyModal({
  children,
  place,
}: {
  children: ReactNode;
  place: Place;
}) {
  const router = useRouter();

  return (
    <DeleteDivvyModal onChange={() => router.refresh()} place={place}>
      {children}
    </DeleteDivvyModal>
  );
}

export function _DeleteDivvyButton({
  divvy,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  divvy: Divvy;
}) {
  const ctx = useContext(DeleteDivvyModalContext);

  return <IconButton icon={X} action={() => ctx.update(divvy)} {...props} />;
}
