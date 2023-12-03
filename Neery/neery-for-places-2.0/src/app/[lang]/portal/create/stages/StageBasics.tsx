import { useRef } from "react";

import { StageProps, stages } from ".";
import _Input from "@/components/ui/Input";
import OnboardingBox from "../components/OnboardingBox";
import OnboardingButtons from "../components/OnboardingButtons";
import OnboardingInfoBar from "../components/OnboardingInfoBar";
import { OnboardingInputRow, OnboardingSectionTitle, OnboardingInput as Input } from "../components/OnboardingUtils";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Libraries, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Min } from "@/lib/wme";

const googleMapsLibraries: Libraries = ["places"];

export default function StageBasics({ data, setData, next, back, reset }: StageProps) {
  const { t, i18n } = useTranslation("portal/create/basics");
  const searchBox = useRef<google.maps.places.SearchBox | null>(null);

  return (
    <>
      <OnboardingInfoBar
        title={t("title")}
        blurb={t("blurb")}
      />
      <OnboardingBox>
        <OnboardingSectionTitle>{t("ownerInfo")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Input
            label={t("ownerName")}
            placeholder={t("ownerName_ph")}
            autoComplete="name"
            value={data.ownerName ?? ""}
            onChange={e => setData({ ownerName: e.target.value })}
            required
          />
          <Input
            label={t("ownerPhone")}
            type="tel"
            placeholder={t("ownerPhone_ph")}
            autoComplete="phone"
            value={data.ownerPhone ?? ""}
            onChange={e => setData({ ownerPhone: e.target.value })}
            required
          />
        </OnboardingInputRow>
        <OnboardingSectionTitle>{t("placeInfo")}</OnboardingSectionTitle>
        <OnboardingInputRow>
          <Input
            label={t("placeName")}
            placeholder={t("placeName_ph")}
            value={data.placeName ?? ""}
            onChange={e => setData({ placeName: e.target.value })}
            required
          />
          <Input
            label={t("businessName")}
            placeholder={t("businessName_ph")}
            autoComplete="organization"
            value={data.businessName ?? ""}
            onChange={e => setData({ businessName: e.target.value })}
            required
          />
        </OnboardingInputRow>
        <OnboardingSectionTitle>{t("placeInfo2")}</OnboardingSectionTitle>
        <LoadScript
          googleMapsApiKey="AIzaSyCfQo6W4aDZc67xjSJ59kRauxJHyKE-XSI"
          language={i18n.language}
          libraries={googleMapsLibraries}
        >
          <StandaloneSearchBox
            onLoad={box => {
              searchBox.current = box;
            }}
            onUnmount={() => {
              searchBox.current = null;
            }}
            onPlacesChanged={() => {
              const place = (searchBox.current?.getPlaces() ?? [])[0] ?? null;

              if (place !== null) {
                const opening = ((place as any).current_opening_hours as google.maps.places.PlaceOpeningHours | undefined)?.periods?.map(period =>
                  [period.open, period.close ?? period.open].map(x =>
                    Min.fromParams(
                      (x.day + 7 - 1) % 7,
                      x.hours ?? parseInt(x.time.slice(0, 2), 10),
                      x.minutes ?? parseInt(x.time.slice(2), 10)
                    )
                  ) as [number, number]
                );

                setData({
                  addressCountry: place.address_components?.find(x => x.types.includes("country"))?.long_name,
                  addressCity: place.address_components?.find(x => x.types.includes("locality"))?.long_name,
                  addressLine: [
                    place.address_components?.find(x => x.types.includes("route"))?.long_name,
                    place.address_components?.find(x => x.types.includes("street_number"))?.long_name
                  ].filter(x => x).join(" "),
                  addressCounty: place.address_components?.find(x => x.types.includes("administrative_area_level_2"))?.long_name,
                  addressState: place.address_components?.find(x => x.types.includes("administrative_area_level_1"))?.long_name,
                  addressZip: place.address_components?.find(x => x.types.includes("postal_code"))?.long_name,
                  latitude: place.geometry?.location?.lat(),
                  longitude: place.geometry?.location?.lng(),
                  placePhone: place.international_phone_number,
                  placeWebsite: place.website,
                  opening,
                });
              }
            }}
          >
            <_Input
              type="text"
              placeholder="Search..."
              className="w-full"
            />
          </StandaloneSearchBox>
        </LoadScript>
        <OnboardingButtons
          valid={
            data.ownerPhone !== undefined
            && data.placeName !== undefined
            && data.businessName !== undefined
            && data.addressCountry !== undefined
            && data.addressCity !== undefined
            && data.addressLine !== undefined
            && data.addressCountry.trim().length > 0
            && data.addressCity.trim().length > 0
            && data.addressLine.trim().length > 0
            && data.latitude !== undefined
            && data.longitude !== undefined
          }
          next={next}
          back={back}
          reset={reset}
          i={stages.indexOf("basics")}
        />
      </OnboardingBox>
    </>
  );
}
