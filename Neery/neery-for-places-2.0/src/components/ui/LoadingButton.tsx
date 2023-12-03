"use client";

import { useState } from "react";
import Button, { ButtonButtonProps } from "./Button";
import { Loader } from "./icons";

export default function LoadingButton({
  action,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  action(): Promise<any> | any,
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Button
      action={() => {
        if (loading) return;

        setLoading(true);
        Promise.resolve(action())
          .finally(() => setLoading(false));
      }}
      {...props}
    >
      {loading ? (
        <Loader className="h-[1em] w-[1em]" />
      ) : children}
    </Button>
  );
}

export function ManualLoadingButton({
  action,
  children,
  loading,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  loading: boolean,
  action(): any,
}) {
  return (
    <Button
      action={() => {
        if (loading) return;

        action();
      }}
      {...props}
    >
      {loading ? (
        <Loader className="h-[1em] w-[1em]" />
      ) : children}
    </Button>
  );
}
