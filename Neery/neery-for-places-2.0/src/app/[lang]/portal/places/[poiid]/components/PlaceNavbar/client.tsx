"use client";

import Button from "@/components/ui/Button";
import Select, { SelectProps } from "@/components/ui/Select";
import { usePathname, useRouter } from "next/navigation";
import { PlacePage } from ".";
import { ReactNode, useContext } from "react";
import { Place, patchPlace } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { CheckCircle, Warning } from "@/components/ui/icons";
import { ClosedPlaceContext } from "./components/PausePlaceModal";
import { Trans } from "react-i18next/TransWithoutContext";
import { OnboardingModalContext } from "@/app/[lang]/components/onboarding/OnboardingModalContext";

export function _PlaceSelect(props: Omit<SelectProps<string>, "setValue">) {
  const router = useRouter();
  // TODO: Re-enable onboard 3 when done -MG
  // const oCtx = useContext(OnboardingModalContext);

  return (
    <Select
      autoWidth={false}
      setValue={(poiid) => {
        if (poiid === "#create") {
          router.push("/portal/create");
          // oCtx.update({});
        } else {
          router.push(`/portal/places/${poiid}`);
        }
      }}
      {...props}
    />
  );
}
export function _PlaceToggle({
  poiid,
  place,
}: {
  poiid: string;
  place: Place;
}) {
  const router = useRouter();
  const ctx = useContext(ClosedPlaceContext);
  const { t, i18n } = useTranslation("portal/navbar");
  const isPaused =
    place.unavailable_until && place.unavailable_until > Date.now() / 1000;
  const unavailableUntil = new Date(
    place.unavailable_until ? place.unavailable_until * 1000 : 0
  );
  return (
    <div className="flex flex-col">
      <div className="text-[12px] font-sans font-semibold font-regular text-center mb-2">
        <div className="flex flex-row justify-center items-center">
          {isPaused ? <Warning /> : <CheckCircle />}
          <div className="flex-1">
            {isPaused ? (
              isNaN(unavailableUntil.valueOf()) ||
              unavailableUntil.getFullYear() - 5 > new Date().getFullYear() ? (
                t("pausedPlace") // probably manually paused
              ) : (
                /* @ts-ignore stupid i18n thing -MG */
                <Trans
                  i18n={i18n}
                  ns="portal/navbar"
                  i18nKey="pausedPlaceUntil"
                  values={{
                    until: unavailableUntil.toLocaleString(i18n.language),
                  }}
                  shouldUnescape={true}
                >
                  Your place is paused, you cannot accept reservations until{" "}
                  {"{{ until }}"}.
                </Trans>
              )
            ) : (
              t("activePlace")
            )}
          </div>
        </div>
      </div>
      <Button
        palette="secondary"
        size="medium"
        className="font-[500]"
        role="radio"
        onClick={async () => {
          if (isPaused) {
            await patchPlace(poiid, { unavailableUntil: Date.now() / 1000 });
            router.refresh();
          } else {
            ctx.update({ unavailable_until: 0 });
          }
        }}
      >
        {isPaused ? t("enableButton") : t("disableButton")}
      </Button>
    </div>
  );
}
export function _PlacePageNav({
  poiid,
  page,
  children,
}: {
  poiid: string;
  page: PlacePage;
  children: ReactNode;
}) {
  const path = usePathname() ?? "";

  return (
    <Button
      key={page}
      palette="portalNav"
      size="medium"
      className="font-[500]"
      action={`/portal/places/${poiid}/${page}`}
      role="radio"
      aria-checked={
        path.includes(`/portal/places/${poiid}/${page}`) ? "true" : "false"
      }
    >
      {children}
    </Button>
  );
}
