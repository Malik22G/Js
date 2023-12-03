import { Place, getPlace } from "@/lib/api/places";
import {
  ReservationContext,
  SettingsReservationForm,
  _ReservationSubmit,
  _ReservationAutotableSelect,
  _ServicesSelect,
} from "./client";
import ConfigForm from "../../components/Config/ConfigForm";
import { Input, InputGroup } from "../../components/Config/ConfigInput";
import InputUI from "@/components/ui/Input";
import ConfigError from "../../components/Config/ConfigError";
import Labelled from "@/components/ui/Labelled";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";
import { ReminderMail } from "@/components/ui/icons";

function placeToForm(place: Place): SettingsReservationForm {
  return {
    email: place.reservation_email,
    granularity: place.granularity,
    deadline: place.deadline,
    maxCount: place.max_count_per_reservation,
    defaultLength: place.default_reservation_length,
    maxDistance: place.max_reservation_distance,
    autotable: place.autotable ?? 0,
    notifications_enabled: place.notifications_enabled ?? false,
    additional_services: place.additional_services,
    auto_remind: place.auto_remind,
  };
}

export default async function PageSettingsReservation({
  params,
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, place] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/reservation"),
    getPlace(params.poiid),
  ]);

  const defaultForm = {
    form: placeToForm(place),
    time: Date.now(),
  };
  return (
    <ConfigForm<SettingsReservationForm>
      context={ReservationContext}
      defaultForm={defaultForm}
      title={t("title")}
    >
      <InputGroup>
        <Input<SettingsReservationForm>
          label={t("notificationMailLabel")}
          placeholder={place.email ?? t("notificationMailPlaceholder")}
          context={ReservationContext}
          name="email"
          className="w-full xl:w-4/5"
        />
        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("notificationLabel")}
          <Input<SettingsReservationForm>
            bare
            type="checkbox"
            rootClassName="!flex-row"
            context={ReservationContext}
            name="notifications_enabled"
            className="w-auto"
          />
        </div>
        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          <ReminderMail className="text-primary h-[16px]"/>
          {t("autoRemind")}
          <Input<SettingsReservationForm>
            bare
            type="checkbox"
            rootClassName="!flex-row"
            context={ReservationContext}
            name="auto_remind"
            className="w-auto"
          />
        </div>
        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("reservationGranularity1")}
          <Input<SettingsReservationForm>
            bare
            context={ReservationContext}
            name="granularity"
            type="number"
            step={15}
            min={15}
            max={60}
            className="w-[96px]"
          />
          {t("reservationGranularity2")}
        </div>

        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("reservationDeadline1")}
          <Input<SettingsReservationForm>
            bare
            context={ReservationContext}
            name="deadline"
            type="number"
            step={place.granularity}
            min={0}
            className="w-[96px]"
          />
          {t("reservationDeadline2")}
        </div>

        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("maxCount")}
          <Input<SettingsReservationForm>
            bare
            context={ReservationContext}
            name="maxCount"
            type="number"
            step={1}
            min={0}
            className="w-[96px]"
          />
          {t("count")}
        </div>

        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("reservationLength1")}
          <Input<SettingsReservationForm>
            bare
            context={ReservationContext}
            name="defaultLength"
            type="number"
            step={place.granularity}
            min={place.granularity}
            className="w-[96px]"
          />
          {t("reservationLength2")}
        </div>

        <div
          className={`
          flex items-center flex-wrap gap-2
          text-[14px] leading-[18px] font-work font-regular
        `}
        >
          {t("maxDistance1")}
          <Input<SettingsReservationForm>
            bare
            context={ReservationContext}
            name="maxDistance"
            type="number"
            step={1}
            min={1}
            className="w-[96px]"
          />
          {t("maxDistance2")}
        </div>

        <Labelled label={t("autotable")} className="w-full md:w-1/2">
          <_ReservationAutotableSelect />
        </Labelled>

        <Labelled label={t("services")} className="w-full xl:w-4/5">
          <_ServicesSelect />
        </Labelled>
      </InputGroup>

      <ConfigError context={ReservationContext} />

      <_ReservationSubmit poiid={place.poiid} />
    </ConfigForm>
  );
}
