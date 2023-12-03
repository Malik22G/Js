import { LangProps } from "@/app/[lang]/props";
import ConfigForm from "../../components/Config/ConfigForm";
import {
  _LunchMenu,
  _LunchMenuSubmit,
  LunchMenuContext,
  SettingsLunchMenuForm,
} from "./client";
import { getLunchMenu } from "@/lib/api/lunchmenu";
import { getPlace } from "@/lib/api/places";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";

export default async function PlaceSettingsLunchMenu({
  params: { poiid, lang },
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, place, lunchMenu] = await Promise.all([
    loadAndUseTranslation(lang, "portal/settings/lunchMenu"),
    getPlace(poiid),
    getLunchMenu(poiid),
  ]);

  const defaultForm = {
    form:
      lunchMenu && lunchMenu.menu
        ? lunchMenu.menu
        : {
            duration: [720, 780] as [number, number],
            menus: [],
            image_url: "",
          },
    time: Date.now(),
  };

  return (
    <ConfigForm<SettingsLunchMenuForm>
      context={LunchMenuContext}
      defaultForm={defaultForm}
      title={t("title")}
    >
      <_LunchMenu place={place} />
      <_LunchMenuSubmit poiid={poiid} />
    </ConfigForm>
  );
}
