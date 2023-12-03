"use client";

import { useContext, useEffect } from "react";
import { createFormContext } from "../../components/Config/ConfigForm";
import ConfigSubmit from "../../components/Config/ConfigSubmit";
import { patchPlace } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export type SettingsAppearanceForm = {
  hide_zones: boolean;
  print_mode: 0 | 1;
};

const defaultAppearanceForm: SettingsAppearanceForm = {
  hide_zones: false,
  print_mode: 0,
};

export const AppearanceContext = createFormContext<SettingsAppearanceForm>(
  defaultAppearanceForm
);

export function _AppearanceSubmit({ poiid }: { poiid: string }) {
  const ctx = useContext(AppearanceContext);
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
            hide_zones: ctx.form.hide_zones,
            print_mode: ctx.form.print_mode,
          });
          wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
          ctx.setError(undefined);
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

export function _PrintRadio() {
  const ctx = useContext(AppearanceContext);
  const { t } = useTranslation("portal/settings/appearance");

  return (
    <div
      className={`
      flex items-center flex-wrap gap-2
      text-[14px] leading-[18px] font-work font-regular
    `}
    >
      {t("printout")}
      <input
        type="radio"
        name="print_mode"
        checked={ctx.form.print_mode === 0}
        onChange={(e) =>
          e.target.checked ? ctx.update({ print_mode: 0 }) : null
        }
        className="w-auto"
      />
      {t("compact")}
      <input
        type="radio"
        name="print_mode"
        checked={ctx.form.print_mode === 1}
        onChange={(e) =>
          e.target.checked ? ctx.update({ print_mode: 1 }) : null
        }
        className="w-auto"
      />
      {t("simple")}
    </div>
  );
}
