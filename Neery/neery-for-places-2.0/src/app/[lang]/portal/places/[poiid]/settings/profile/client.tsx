"use client";

import { useContext, useEffect } from "react";

import { useTranslation } from "@/app/[lang]/i18n/client";
import ChipSelect from "@/components/ui/ChipSelect";
import {
  FacebookLink,
  PlaceTag,
  fBImportPlace,
  fBPushPlace,
  patchPlace,
  placeTags,
} from "@/lib/api/places";
import { createFormContext } from "../../components/Config/ConfigForm";
import ConfigSubmit from "../../components/Config/ConfigSubmit";
import Labelled from "@/components/ui/Labelled";
import SpanPicker from "@/components/ui/SpanPicker";
import { wme2osm } from "@/lib/wme";
import FacebookPageSelect from "../../components/FacebookPageSelect";
import Button from "@/components/ui/Button";
import LoadingButton from "@/components/ui/LoadingButton";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export type SettingsProfileForm = {
  name: string;
  address: string;
  tags: PlaceTag[];
  opening: [number | null, number | null][];
  email?: string;
  phone?: string;
  webpage?: string;
  facebook?: string;
  instagram?: string;
  facebookLink: Partial<FacebookLink> | null;
};

const defaultProfileForm: SettingsProfileForm = {
  name: "",
  address: "",
  tags: [],
  opening: [],
  facebookLink: {},
};

export const ProfileContext =
  createFormContext<SettingsProfileForm>(defaultProfileForm);

export function _ProfileChips() {
  const ctx = useContext(ProfileContext);
  const { t: tagT } = useTranslation("tags");
  const { t } = useTranslation("portal/settings/profile");

  return (
    <Labelled label={t("tags")}>
      <ChipSelect
        chips={placeTags.map((tag) => [tag, tagT(tag)])}
        value={ctx.form.tags}
        onChange={(tags) => ctx.update({ tags })}
      />
    </Labelled>
  );
}

export function _ProfileFacebookPage({ poiid }: { poiid: string }) {
  const ctx = useContext(ProfileContext);
  if (ctx.form.facebookLink !== null && ctx.form.facebookLink.pageId) {
    return (
      <>
        <div>Linked Facebook Page: {ctx.form.facebookLink.pageName}</div>
        <Button
          palette="secondary"
          action={() => {
            ctx.update({
              facebookLink: null,
            });
          }}
        >
          Change Facebook Page
        </Button>
        <div className="flex gap-4 flex-wrap items-center justify-center">
          <LoadingButton
            palette="secondary"
            action={async () => {
              await fBPushPlace(poiid);
            }}
          >
            Push Data
          </LoadingButton>
          <LoadingButton
            palette="secondary"
            action={async () => {
              await fBImportPlace(poiid);
            }}
          >
            Import Data
          </LoadingButton>
        </div>
      </>
    );
  }

  return (
    <FacebookPageSelect
      value={ctx.form.facebookLink ?? {}}
      setValue={(value) => {
        ctx.update({
          facebookLink:
            typeof value === "function"
              ? value(ctx.form.facebookLink ?? {})
              : value,
        });
      }}
    />
  );
}

export function _ProfileSpanPicker() {
  const ctx = useContext(ProfileContext);
  const { t } = useTranslation("portal/settings/profile");

  return (
    <Labelled label={t("opening")}>
      <SpanPicker
        spans={ctx.form.opening}
        update={(opening) => ctx.update({ opening })}
      />
    </Labelled>
  );
}

export function _ProfileSubmit({ poiid }: { poiid: string }) {
  const ctx = useContext(ProfileContext);
  const { t } = useTranslation("portal/settings/profile");
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <ConfigSubmit
      submit={async () => {
        try {
          await patchPlace(poiid, {
            opening: wme2osm(
              ctx.form.opening.filter((x) => x.every((x) => x !== null)) as [
                number,
                number
              ][]
            ),
            tags: ctx.form.tags,
            email: ctx.form.email,
            phone: ctx.form.phone,
            webpage: ctx.form.webpage,
            facebook: ctx.form.facebook,
            instagram: ctx.form.instagram,
            ...(!ctx.form.facebookLink?.pageName && {
              facebookLink: ctx.form.facebookLink,
            }),
          });
          ctx.setError(undefined);
          wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
        } catch (_) {
          ctx.setError("An unknown error occurred.");
        }
      }}
      ctx={ctx}
    >
      {t("save")}
    </ConfigSubmit>
  );
}
