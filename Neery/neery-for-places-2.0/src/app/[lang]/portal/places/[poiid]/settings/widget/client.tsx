"use client";

import Input from "@/components/ui/Input";
import LoadingButton from "@/components/ui/LoadingButton";
import { Place, patchPlace } from "@/lib/api/places";
import { useContext, useEffect, useState } from "react";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/[lang]/i18n/client";
import IconButton from "@/components/ui/IconButton";
import { Copy, Pen } from "@/components/ui/icons";
import Labelled from "@/components/ui/Labelled";
import TextBox from "@/components/ui/TextBox";

export function LandURL({ poiid }: { poiid: string }) {
  const { t } = useTranslation("portal/settings/widget");
  const root =
    process.env.NEXT_PUBLIC_NEERY_ENV === "production"
      ? "https://places.neery.net"
      : "https://places.staging.neery.net";
  const url = `${root}/land/${encodeURIComponent(poiid)}`;
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <div className="flex flex-col">
      <p className="flex w-full mb-3">{t("widgetDescription")}</p>
      <Labelled label={t("longLink")}> </Labelled>
      <div className="flex w-full gap-[8px] items-center">
        <Input bare className="grow" value={url} disabled />
        <IconButton
          icon={Copy}
          iconClass="w-[0.8rem] h-[0.8rem]"
          action={() => {
            navigator.clipboard.writeText(url);
          }}
        />
      </div>
    </div>
  );
}

export function HandleForm({ place }: { place: Place }) {
  const { t } = useTranslation("portal/settings/widget");
  const router = useRouter();
  const [handle, setHandle] = useState<string | undefined>("");
  const [edit, setEdit] = useState(false);
  const root =
    process.env.NEXT_PUBLIC_NEERY_ENV === "production"
      ? "https://places.neery.net"
      : "https://places.staging.neery.net";
  const url = `${root}/land/${encodeURIComponent(place.handle ?? "")}`;
  useEffect(() => {
    setHandle(place.handle);
  }, [place]);
  const [modiErr, setModiErr] = useState(false);
  return edit || !place.handle ? (
    <div className="flex flex-col gap-[8px] w-full ">
      <p className="text-red font-bold">{t("shortLinkDisclaimer")} </p>
      <p>{t("usedHandle")}</p>
      <Input
        // label={t("handle")}
        bare
        className="grow"
        defaultValue={place.handle}
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      {modiErr && <p>{t("modiErr")}</p>}
      <LoadingButton
        palette="secondary"
        action={async () => {
          if (handle) {
            const pattern = /^[A-Za-z0-9_-]*$/;
            if (pattern.test(handle)) {
              await patchPlace(place.poiid, { handle: handle });
              router.refresh();
              setEdit(false);
              setModiErr(false);
            } else {
              setModiErr(true);
            }
          }
        }}
      >
        {t("save")}
      </LoadingButton>
    </div>
  ) : (
    <div>
      <Labelled label={t("shortLink")}> </Labelled>
      <div className="flex w-full gap-[8px] items-center">
        <Input bare className="grow" value={url} disabled />
        <IconButton
          icon={Copy}
          iconClass="w-[0.8rem] h-[0.8rem]"
          action={() => {
            navigator.clipboard.writeText(url);
          }}
        />
        <IconButton
          icon={Pen}
          iconClass="w-[0.8rem] h-[0.8rem]"
          action={() => {
            setEdit(true);
          }}
        />
      </div>
    </div>
  );
}

export function CopiableTextArea({ url }: { url: string }) {
  const iframeTag = `<iframe src="${url}"/>`;
  return (
    <div className="flex flex-row items-center my-2 gap-2">
      <TextBox className="mt-1 w-full" bare value={iframeTag} disabled />
      <IconButton
        icon={Copy}
        iconClass="w-[0.8rem] h-[0.8rem]"
        action={() => {
          navigator.clipboard.writeText(iframeTag);
        }}
      />
    </div>
  );
}

export function IFrames({ place }: { place: Place }) {
  const { t } = useTranslation("portal/settings/widget");
  const root =
    process.env.NEXT_PUBLIC_NEERY_ENV === "production"
      ? "https://places.neery.net"
      : "https://places.staging.neery.net";
  const url = `${root}/land/${encodeURIComponent(place.poiid)}`;
  return (
    <div>
      <h2 className="font-semibold">{t("embed")}</h2>
      <Labelled className="mt-2" label="Widget"> </Labelled>
      <CopiableTextArea url={url} />
      <Labelled label={t("widgetMenuNoRes")}> </Labelled>
      <CopiableTextArea url={url + "/menu"} />
      <Labelled label={t("widgetMenu")}> </Labelled>
      <CopiableTextArea url={url + "/menu?res"} />
    </div>
  );
}
