import Input from "@/components/ui/Input";
import { ReserveForm, ReserveScreenProps } from "../..";
import ReserveHeader from "../../ReserveHeader";
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import Labelled from "@/components/ui/Labelled";
import ChipSelect from "@/components/ui/ChipSelect";
import {
  Reservation,
  ReservationPost,
  allergens,
  createReservation,
  date2ndt,
  services,
} from "@/lib/api/reservations";
import AddonSelect from "@/components/ui/AddonSelect";
import { useTranslation } from "@/app/[lang]/i18n/client";
import Button from "@/components/ui/Button";
import { Schema } from "ajv";
import ajv from "@/lib/ajv";
import PoweredBy from "@/components/ui/PoweredBy";
import { useSearchParams } from "next/navigation";
import { Trans } from "react-i18next/TransWithoutContext";
import { RefererContext } from "@/app/[lang]/land/[poiid]/components/RefererHandler";

function formLink(
  setForm: Dispatch<SetStateAction<ReserveForm>>,
  field: keyof ReserveForm
): ChangeEventHandler<HTMLInputElement> {
  return (e) => {
    setForm((form) => ({ ...form, [field]: e.target.value }));
  };
}

const SubmittableForm: Schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    phone: { type: "string", minLength: 1 },
    comment: { type: "string" },
    allergens: {
      type: "array",
      items: {
        type: "string",
        enum: allergens,
      },
    },
    services: {
      type: "array",
      items: {
        type: "string",
        enum: services,
      },
    },
  },
  required: ["name", "email", "phone", "comment"],
  additionalProperties: true,
};

export function ReserveInfo({
  place,
  form,
  setForm,
  navigate,
}: ReserveScreenProps) {
  const { i18n, t } = useTranslation("land", {
    keyPrefix: "reserve.screens.info",
  });
  const { t: tagT } = useTranslation("tags");
  const urlSearchParams = useSearchParams();
  const referer = useContext(RefererContext);

  return (
    <div
      className={`
      w-full p-[24px]
      flex flex-col gap-[16px]
      font-work
    `}
    >
      <ReserveHeader place={place} screen="info" navigate={navigate} />

      <Input
        label={t("name")}
        placeholder={t("name_placeholder")}
        autoComplete="name"
        required
        value={form.name}
        onChange={formLink(setForm, "name")}
      />

      <Input
        label={t("email")}
        placeholder={t("email_placeholder")}
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={formLink(setForm, "email")}
      />

      <Input
        label={t("phone")}
        placeholder={t("phone_placeholder")}
        type="tel"
        autoComplete="tel"
        required
        value={form.phone}
        onChange={formLink(setForm, "phone")}
      />

      <Labelled label={t("allergies")}>
        <ChipSelect
          chips={allergens.map((allergen) => [allergen, tagT(allergen)])}
          value={form.allergens}
          onChange={(allergens) => setForm((form) => ({ ...form, allergens }))}
        />
      </Labelled>

      {place.additional_services.length > 0 && (
        <Labelled label={t("services")}>
          <AddonSelect
            addons={place.additional_services.map((service) => [
              service,
              tagT(service),
            ])}
            value={form.services}
            onChange={(services) => setForm((form) => ({ ...form, services }))}
          />
        </Labelled>
      )}

      <Input
        label={t("comment")}
        placeholder={t("comment_placeholder")}
        required
        value={form.comment}
        onChange={formLink(setForm, "comment")}
      />

      <PoweredBy />

      <p className="text-xs text-neutral-500">
        {/* @ts-ignore stupid i18n thing -MG */}
        <Trans i18n={i18n} ns="land" i18nKey="reserve.screens.info.accept_tos">
          A &quot;Foglalás elküldése&quot; gomb megnyomásával elfogadod az{" "}
          <a href={`/${i18n.language}/aszf.pdf`} target="_blank">
            ÁSZF-et
          </a>{" "}
          és az{" "}
          <a href={`/${i18n.language}/gdpr.pdf`} target="_blank">
            Adatvédelmi Nyilatkozatot
          </a>
          .
        </Trans>
      </p>

      <Button
        size="large"
        disabled={!ajv.validate(SubmittableForm, form)}
        action={async () => {
          // TODO: prevent double-send with loading check
          if (form.date === null) return;

          const data: ReservationPost = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            date: date2ndt(form.date),
            count: form.count,
            comment: form.comment,
            sourceUrl: referer ?? undefined,
            locale: i18n.language,
            allergens: form.allergens,
            services: form.services,
            is_lunch: !!urlSearchParams.get("day"),
          };

          // TODO: validate

          let res: Reservation;

          try {
            res = await createReservation(place, data);
          } catch (e) {
            // TODO: capture error with Sentry
            navigate("error");
            return;
          }

          if (res.status === "ACCEPTED") {
            navigate("accepted");
          } else {
            // res.status === "PENDING"
            navigate("pending");
          }
        }}
      >
        {t("button")}
      </Button>
    </div>
  );
}
