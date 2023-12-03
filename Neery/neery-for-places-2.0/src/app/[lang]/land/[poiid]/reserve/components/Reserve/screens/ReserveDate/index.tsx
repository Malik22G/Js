import Button from "@/components/ui/Button";
import { InputContainer, InputLabel } from "./kit";
import { useState } from "react";
import { ReserveScreenProps } from "../..";
import ReserveHeader from "../../ReserveHeader";
import InputDate from "./InputDate";
import InputTime from "./InputTime";
import { useTranslation } from "@/app/[lang]/i18n/client";
import PoweredBy from "@/components/ui/PoweredBy";
import PMNumberInput from "@/components/ui/PMNumberInput";
import { Trans } from "react-i18next";

export default function ReserveDate({
  place,
  form,
  setForm,
  navigate,
  fullscreen,
}: ReserveScreenProps) {
  const { i18n, t } = useTranslation("land", { keyPrefix: "reserve.screens.date" });

  const [dateValid, setDateValid] = useState(false);
  const [timeValid, setTimeValid] = useState(false);

  return (
    <div className={`
      w-full py-[24px] px-[16.5px]
      flex flex-col gap-[16px]
      font-work
    `}>
      <ReserveHeader
        place={place}
        screen="date"
        navigate={navigate}
      />

      <InputContainer className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <InputLabel>{t("guests")}</InputLabel>

          <PMNumberInput
            value={form.count}
            min={0}
            max={place.max_count_per_reservation}
            onChange={count => setForm(x => ({ ...x, count }))}
          />
        </div>
        
        {form.count === place.max_count_per_reservation ? (
          <div className="bg-red/25 rounded-[8px] p-[8px] text-sm leading-compact">
            {/* @ts-ignore stupid i18n thing -MG */}
            <Trans i18n={i18n} ns="land" i18nKey="reserve.screens.date.contact" values={{max: place.max_count_per_reservation}}>
              For reservations above {"{{max}}"} guests, please contact the place via <a className="underline" href={"tel:" + encodeURIComponent(place.phone ?? "")}>phone</a> or <a className="underline" href={"mailto:" + encodeURIComponent(place.email ?? "")}>e-mail</a>.
            </Trans>
          </div>
        ) : null}
      </InputContainer>

      <InputDate
        place={place}
        count={form.count}
        date={form.date}
        setDate={date => setForm(x => ({ ...x, date }))}
        setDateValid={setDateValid}
      />

      <InputTime
        place={place}
        count={form.count}
        date={form.date}
        setDate={date => setForm(x => ({ ...x, date }))}
        dateValid={dateValid}
        setTimeValid={setTimeValid}
        fullscreen={fullscreen}
      />

      <PoweredBy />

      <Button
        size="large"
        disabled={form.count === 0 || !dateValid || !timeValid}
        action={() => navigate("info")}
      >
        {t("button")}
      </Button>
    </div>
  );
}
