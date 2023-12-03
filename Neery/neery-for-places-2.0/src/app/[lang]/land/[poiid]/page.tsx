import { Metadata } from "next";
import Image from "next/image";

import { getPlace } from "@/lib/api/places";
import { getImagesFromPlace } from "@/lib/api/images";
import { getMenu } from "@/lib/api/meals";
import { loadAndUseTranslation } from "../../i18n";
import { LangProps } from "../../props";
import InfoHeader from "./components/sections/InfoHeader";
import FeaturedMealsSection from "./components/sections/FeaturedMealsSection";
import MenuSection from "./components/sections/MenuSection";
import Reserve from "./reserve/components/Reserve";
import Button from "@/components/ui/Button";
import PoweredBy from "@/components/ui/PoweredBy";
import { MealModalProvider } from "./components/MealModal";
import { Language } from "../../i18n/settings";
import { getFranchise } from "@/lib/api/franchises";
import { redirect } from "next/navigation";
import ReviewSection from "./components/sections/ReviewSection";
import { getRatingFromPlace, getReviewsFromPlace } from "@/lib/api/reviews";
import LunchMenuSection from "@/app/[lang]/land/[poiid]/components/sections/LunchMenuSection";
import { getLunchMenu } from "@/lib/api/lunchmenu";
import { Carousel } from "./components/Carousel";

export async function generateMetadata({
  params: { poiid },
}: {
  params: { poiid: string };
}): Promise<Metadata> {
  const notFound: Metadata = {
    title: "Not Found",
    description: "We couldn't find this place on NeerY.",
  };

  if (poiid.startsWith("f")) {
    try {
      const franchise = await getFranchise(poiid);

      return {
        title: franchise.name,
        description: "A franchise on NeerY.",
      };
    } catch (e) {
      return notFound;
    }
  } else {
    try {
      const place = await getPlace(poiid);
      const images = await getImagesFromPlace(poiid);

      return {
        title: place.name,
        description: "A place on NeerY.",
        openGraph: {
          title: place.name,
          images:
            images.length > 0
              ? {
                  url: images[0].url,
                }
              : undefined,
        },
      };
    } catch (e) {
      return notFound;
    }
  }
}

async function PlaceOverview({
  poiid,
  lang,
  res,
}: {
  poiid: string;
  lang: Language;
  res?: string;
}) {
  if (res !== undefined) {
    redirect(
      `/land/${encodeURIComponent(poiid)}/menu?res=${encodeURIComponent(res)}`
    );
  }

  const [{ i18n, t }, place, menu, images, rating, reviews, lunchMenu] =
    await Promise.all([
      loadAndUseTranslation(lang, "land"),
      getPlace(poiid),
      getMenu(poiid),
      getImagesFromPlace(poiid),
      getRatingFromPlace(poiid),
      getReviewsFromPlace(poiid),
      getLunchMenu(poiid),
    ]);

  return (
    <main className="w-full h-full">
      <MealModalProvider>
        <div className="w-full h-[240px] relative fixed">
          <Carousel images={images} alt={place.name} />
        </div>

        <div
          className={`
          w-full bg-neutral-100 flex gap-[64px] justify-center md:items-start
          min-h-[calc(100%-193px)] relative top-[-47px] rounded-t-[32px] py-[24px]
          md:min-h-[calc(100%-240px)] md:static md:rounded-none md:py-[40px]
        `}
        >
          <div
            className={`
            flex flex-col
            w-full gap-[16px]
            md:w-4/5 md:gap-[32px]
            lg:w-1/2
          `}
          >
            <InfoHeader i18n={i18n} place={place} />
            <LunchMenuSection
              i18n={i18n}
              lunchMenu={lunchMenu?.menu ?? undefined}
              place={place}
            />
            <FeaturedMealsSection i18n={i18n} meals={menu.meals} />
            <MenuSection i18n={i18n} place={place} menu={menu} />
            <ReviewSection
              i18n={i18n}
              place={place}
              rating={rating}
              reviews={reviews}
            />

            <PoweredBy className="mt-auto mb-[64px] md:hidden" />

            <Button
              palette="primary"
              size="large"
              className={`
                lg:hidden
                fixed bottom-[24px] left-[24px] right-[24px] z-40
              `}
              action={`/land/${place.poiid}/reserve`}
            >
              {t("reserveButton")}
            </Button>
          </div>

          <div
            className={`
            hidden lg:block w-[375px] sticky top-[16px]
            rounded-[16px] shadow-2 border border-neutral-300 bg-neutral-100
            max-h-[calc(100vh-32px)] overflow-y-scroll scrollbar-hidden
          `}
          >
            <Reserve place={place} fullscreen={false} />
          </div>
        </div>

        <div className="w-full mt-auto hidden md:block pb-[16px]">
          <PoweredBy />
        </div>
      </MealModalProvider>
    </main>
  );
}

async function FranchisePicker({ poiid }: { poiid: string }) {
  const franchise = await getFranchise(poiid);

  if (franchise.places.length === 1) {
    return redirect(`/land/${franchise.places[0].poiid}`);
  }

  return (
    <main className="flex w-full h-full justify-center">
      <div className="flex flex-col w-full md:w-1/2 h-full justify-center gap-[8px] px-[16px]">
        {franchise.places.map((x) => (
          <Button
            key={x.poiid}
            palette="secondary"
            action={`/land/${x.poiid}`}
            className="h-fit py-2"
          >
            <div className="flex flex-grow">
              <div className="flex flex-col">
                <div className="text text-base">{x.name}</div>
                <div className="text-neutral-500 text-xs italic">
                  {x.postal_code} {x.city}, {x.street}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </main>
  );
}

export default async function LandLanding({
  params: { poiid, lang },
  searchParams: { res },
}: {
  params: { poiid: string };
  searchParams: { res?: string };
} & LangProps) {
  if (poiid.startsWith("f")) {
    /* @ts-expect-error: async component */
    return <FranchisePicker poiid={poiid} />;
  } else {
    /* @ts-expect-error: async component */
    return <PlaceOverview poiid={poiid} lang={lang} res={res} />;
  }
}
