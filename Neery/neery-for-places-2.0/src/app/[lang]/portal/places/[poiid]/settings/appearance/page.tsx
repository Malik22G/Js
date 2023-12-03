import { Place, getPlace } from "@/lib/api/places";
import {
  AppearanceContext,
  SettingsAppearanceForm,
  _AppearanceSubmit,
  _PrintRadio,
} from "./client";
import ConfigForm from "../../components/Config/ConfigForm";
import { Input, InputGroup } from "../../components/Config/ConfigInput";
import ConfigError from "../../components/Config/ConfigError";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";

function placeToForm(place: Place): SettingsAppearanceForm {
  return {
    hide_zones: place.hide_zones ?? false,
    print_mode: place.print_mode ?? 0,
  };
}

export default async function PageSettingsAppearance({
  params,
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, place] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/appearance"),
    getPlace(params.poiid),
  ]);

  const defaultForm = {
    form: placeToForm(place),
    time: Date.now(),
  };

  return (
    <ConfigForm<SettingsAppearanceForm>
      context={AppearanceContext}
      defaultForm={defaultForm}
      title={t("title")}
    >
      <InputGroup>
        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          <Input<SettingsAppearanceForm>
            bare
            type="checkbox"
            rootClassName="!flex-row"
            context={AppearanceContext}
            name="hide_zones"
            className="w-auto"
          />
          {t("hideZonesLabel")}
        </div>

        <_PrintRadio />
      </InputGroup>

      <ConfigError context={AppearanceContext} />

      <_AppearanceSubmit poiid={place.poiid} />
    </ConfigForm>
  );
}
