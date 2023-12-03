"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { Loader } from "@/components/ui/icons";

export default function ConfigSubmit({
  submit,
  children,
  ctx,
}: {
  submit(): Promise<void>;
  children: ReactNode;
  ctx: any;
}) {
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const button = useRef<HTMLAnchorElement | HTMLButtonElement>();
  const router = useRouter();

  useEffect(() => {
    setWidth(button.current?.clientWidth ?? 0);
  }, [button]);

  useEffect(() => {
    setLoading(false);
  }, [ctx]);

  return (
    <Button
      ref={button}
      size="medium"
      palette="secondary"
      style={{
        width: loading ? width : "min-content",
      }}
      action={async () => {
        setLoading(true);
        await submit();
        // setLoading(false);
        router.refresh();
      }}
    >
      {loading ? <Loader className="w-[1.5em] h-[1.5em]" /> : children}
    </Button>
  );
}
