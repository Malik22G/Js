"use client";

import { Access } from "@/lib/api/access";
import { ReactNode, useContext, useEffect } from "react";
import CreateAccessModal, {
  CreateAccessModalContext,
} from "./components/CreateAccessModal";
import { useRouter } from "next/navigation";
import Button, { ButtonButtonProps } from "@/components/ui/Button";
import { User } from "@/lib/api/users";
import IconButton, { IconButtonButtonProps } from "@/components/ui/IconButton";
import { Pen, X } from "@/components/ui/icons";
import DeleteAccessModal, {
  DeleteAccessModalContext,
} from "./components/DeleteAccessModal";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function _CreateAccessModal({
  access,
  children,
}: {
  access: Access;
  children: ReactNode;
}) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update(null);
  }, []);
  return (
    <CreateAccessModal onChange={() => router.refresh()} access={access}>
      {children}
    </CreateAccessModal>
  );
}

export function _DeleteAccessModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <DeleteAccessModal onChange={() => router.refresh()}>
      {children}
    </DeleteAccessModal>
  );
}

export function _CreateAccessModalButton({
  children,
  poiid,
  ...props
}: ButtonButtonProps & { poiid: string }) {
  const ctx = useContext(CreateAccessModalContext);

  return (
    <Button {...props} action={() => ctx.update({ poiid })}>
      {children}
    </Button>
  );
}

export function _EditAccessModalButton({
  children,
  poiid,
  access,
  user,
  ...props
}: Omit<IconButtonButtonProps, "icon"> & {
  poiid: string;
  access: Access;
  user: User;
}) {
  const ctx = useContext(CreateAccessModalContext);

  return (
    <IconButton
      {...props}
      icon={Pen}
      action={() => ctx.update({ poiid, user, role: access.role })}
    >
      {children}
    </IconButton>
  );
}

export function _DeleteAccessModalButton({
  children,
  poiid,
  access,
  user,
  ...props
}: Omit<IconButtonButtonProps, "icon"> & {
  poiid: string;
  access: Access;
  user: User;
}) {
  const ctx = useContext(DeleteAccessModalContext);

  return (
    <IconButton
      {...props}
      icon={X}
      action={() => ctx.update({ poiid, user, access })}
    >
      {children}
    </IconButton>
  );
}
