import { Place, getPlace } from "@/lib/api/places";
import {
  SettingsProfileForm,
  ProfileContext,
  _ProfileChips,
  _ProfileSpanPicker,
  _ProfileSubmit,
  _ProfileFacebookPage,
} from "./client";
import { Input, InputGroup } from "../../components/Config/ConfigInput";
import ConfigForm from "../../components/Config/ConfigForm";
import ConfigError from "../../components/Config/ConfigError";
import { osm2wme } from "@/lib/wme";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";

function placeToForm(place: Place): SettingsProfileForm {
  return {
    name: place.name,
    address: `${place.postal_code ? place.postal_code + " " : ""}${
      place.city
    }, ${place.street}`,
    tags: place.tags,
    opening: place.opening ? osm2wme(place.opening) : [],
    email: place.email,
    phone: place.phone,
    webpage: place.webpage,
    facebook: place.facebook,
    instagram: place.instagram,
    facebookLink: place.integrations?.facebook || {},
  };
}

export default async function PlaceSettingsProfile({
  params,
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, place] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/profile"),
    getPlace(params.poiid),
  ]);
  const defaultForm = {
    form: placeToForm(place),
    time: Date.now(),
  };

  return (
    <ConfigForm<SettingsProfileForm>
      context={ProfileContext}
      defaultForm={defaultForm}
      title={t("title")}
      description={t("titleDescription")}
    >
      <InputGroup title={t("basicsTitle")}>
        <Input<SettingsProfileForm>
          label={t("inputNameLabel")}
          placeholder={t("inputNamePlaceholder")}
          context={ProfileContext}
          name="name"
          disabled
          className="w-full xl:w-4/5"
        />

        <Input<SettingsProfileForm>
          label={t("inputAddressLabel")}
          placeholder={t("inputAddressPlaceholder")}
          context={ProfileContext}
          name="address"
          disabled
          className="w-full xl:w-4/5"
        />

        <_ProfileSpanPicker />

        <_ProfileChips />
      </InputGroup>

      <InputGroup title={t("contactsTitle")}>
        <Input<SettingsProfileForm>
          label={t("inputEMailLabel")}
          placeholder={t("inputEMailPlaceholder")}
          context={ProfileContext}
          name="email"
          className="w-full xl:w-4/5"
        />

        <Input<SettingsProfileForm>
          label={t("inputPhoneLabel")}
          placeholder={t("inputPhonePlaceholder")}
          context={ProfileContext}
          name="phone"
          className="w-full xl:w-4/5"
        />

        <Input<SettingsProfileForm>
          label={t("inputWebLabel")}
          placeholder={t("inputWebPlaceholder")}
          context={ProfileContext}
          name="webpage"
          className="w-full xl:w-4/5"
        />

        <Input<SettingsProfileForm>
          label="Facebook"
          placeholder="https://facebook.com/csodasetterem"
          context={ProfileContext}
          name="facebook"
          className="w-full xl:w-4/5"
        />

        <Input<SettingsProfileForm>
          label="Instagram"
          placeholder="csodasetterem"
          context={ProfileContext}
          name="instagram"
          className="w-full xl:w-4/5"
        />
      </InputGroup>

      {/*  <InputGroup title="Facebook Page">
        <_ProfileFacebookPage poiid={params.poiid} />
      </InputGroup> */}

      <ConfigError context={ProfileContext} />

      <_ProfileSubmit poiid={params.poiid} />
    </ConfigForm>
  );
}
