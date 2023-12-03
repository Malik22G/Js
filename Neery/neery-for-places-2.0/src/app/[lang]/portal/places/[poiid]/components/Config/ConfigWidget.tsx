"use client";
import React, { ReactNode, useContext } from "react";
import WidgetBox from "./ConfigWidget/WidgetBox";
import { createWidgetContext } from "./ConfigWidget/WidgetContext";
export const ClosedWidgetContext = createWidgetContext<{
  key?: number;
}>();

function InnerBox({ url }: { url: string }) {
  let ctx = useContext(ClosedWidgetContext);
  return (
    <>
      <div className="font-bold mb-2">Widget Preview</div>
      <iframe
        key={ctx.data?.key}
        src={url}
        height={700}
        width={"400px"}
        className="rounded-2xl shadow-4"
      />
    </>
  );
}

export default function ConfigWidget({
  poiid,
  lang,
  children,
}: {
  poiid: string;
  lang: string;
  children: ReactNode;
}) {
  const root =
    process.env.NEXT_PUBLIC_NEERY_ENV === "production"
      ? "https://places.neery.net"
      : "https://places.staging.neery.net";

  const url = `${root}/${lang}/land/${encodeURIComponent(poiid)}`;
  return (
    <WidgetBox context={ClosedWidgetContext} siblings={children}>
      <InnerBox {...{ url }} />
    </WidgetBox>
  );
}
