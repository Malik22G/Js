"use client";

import LoadingButton from "@/components/ui/LoadingButton";
import { setupCalls } from "@/lib/api/calls";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function SetupButton({ poiid }: { poiid: string }) {
  const router = useRouter();
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <LoadingButton
      size="small"
      action={async () => {
        await setupCalls(poiid);
        wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
        router.refresh();
      }}
    >
      Setup
    </LoadingButton>
  );
}
