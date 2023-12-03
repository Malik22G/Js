"use client";

import { useContext, useEffect } from "react";
import { createFormContext } from "../../components/Config/ConfigForm";
import ConfigSubmit from "../../components/Config/ConfigSubmit";
import { patchPlace } from "@/lib/api/places";
import Select from "@/components/ui/Select";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";
import { Service, services } from "@/lib/api/reservations";
import Input from "@/components/ui/Input";
import IconifyServices from "@/components/ui/IconifyServices";

export type SettingsReservationForm = {
  email?: string;
  granularity: number;
  deadline: number;
  maxCount: number;
  defaultLength: number;
  maxDistance: number;
  autotable: number;
  notifications_enabled: boolean;
  auto_remind: boolean;
  additional_services: Service[];
};

const defaultReservationForm: SettingsReservationForm = {
  granularity: 15,
  deadline: 60,
  maxCount: 6,
  defaultLength: 120,
  maxDistance: 60,
  autotable: 0,
  notifications_enabled: true,
  auto_remind: false,
  additional_services: [],
};

export const ReservationContext = createFormContext<SettingsReservationForm>(
  defaultReservationForm
);

export function _ReservationAutotableSelect() {
  const ctx = useContext(ReservationContext);

  return (
    <Select<number>
      value={ctx.form.autotable}
      values={[
        [0, "Manual"],
        [1, "Automatic"],
      ]}
      className="w-full"
      setValue={(val) => {
        return ctx.update({ autotable: val });
      }}
    />
  );
}

export function _ServicesSelect() {
  const ctx = useContext(ReservationContext);
  const { t: tagT } = useTranslation("tags");

  return (
    <>
      {services.map((service) => (
        <div key={service} className="py-2 flex flex-row gap-2">
          <Input
            type="checkbox"
            bare
            className="w-auto"
            checked={ctx.form.additional_services.includes(service)}
            onChange={(e) => {
              if (e.target.checked) {
                ctx.update({
                  additional_services: [
                    ...ctx.form.additional_services,
                    service,
                  ],
                });
              } else {
                ctx.update({
                  additional_services: [
                    ...ctx.form.additional_services.filter(
                      (item) => item !== service
                    ),
                  ],
                });
              }
            }}
          />
          <IconifyServices
            key={service}
            iconTag={service}
            className="text-primary"
          />
          {tagT(service)}
        </div>
      ))}
    </>
  );
}

export function _ReservationSubmit({ poiid }: { poiid: string }) {
  const ctx = useContext(ReservationContext);
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
            reservationEmail: ctx.form.email,
            granularity: ctx.form.granularity,
            deadline: ctx.form.deadline,
            maxCountPerReservation: ctx.form.maxCount,
            defaultReservationLength: ctx.form.defaultLength,
            maxReservationDistance: ctx.form.maxDistance,
            autotable: ctx.form.autotable,
            notifications_enabled: ctx.form.notifications_enabled,
            additional_services: ctx.form.additional_services,
            auto_remind: ctx.form.auto_remind,
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
