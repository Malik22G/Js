import { ReactNode } from "react";
import PlaceNavbar from "./components/PlaceNavbar";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";
import { getPlace } from "@/lib/api/places";
import PlaceModal from "./components/PlaceNavbar/components/PausePlaceModal";
import OnboardingModal from "@/app/[lang]/components/onboarding/OnboardingModal";

export default async function PlaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { poiid: string };
} & LangProps) {
  const { i18n } = await loadAndUseTranslation(params.lang, "portal/navbar");
  const place = await getPlace(params.poiid);
  return (
    <OnboardingModal>
      <PlaceModal place={place}>
        <div
          className={`
        flex
        w-full h-full
        bg-neutral-100
      `}
        >
          {/* @ts-expect-error: async component */}
          <PlaceNavbar i18n={i18n} poiid={params.poiid} place={place} />
          {children}
        </div>
      </PlaceModal>
    </OnboardingModal>
  );
}
