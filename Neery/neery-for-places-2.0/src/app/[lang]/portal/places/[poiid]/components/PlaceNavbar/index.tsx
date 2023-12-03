import NextImage from "next/image";
import { i18n } from "i18next";

import { getPlacesFromUser } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { _PlaceSelect, _PlacePageNav, _PlaceToggle } from "./client";
import { Image, getImagesFromPlace } from "@/lib/api/images";
import { Place } from "@/lib/api/places";
import { useTranslation } from "@/app/[lang]/i18n";
import { ReactNode } from "react";
import { Plus } from "@/components/ui/icons";

function PlaceSelectItem({ place, image }: { place: Place; image?: Image }) {
  return (
    <div
      className={`
      h-[32px] grow
      flex items-center gap-[8px]
      text-[12px] font-medium
    `}
    >
      {image !== undefined ? (
        <NextImage
          src={image.url}
          width={32}
          height={32}
          className="object-cover h-[32px] w-[32px] rounded-lg shrink-0"
          alt={place.name}
        />
      ) : null}

      <p className="flex w-full h-full items-center truncate">
        {place.name}
      </p>
    </div>
  );
}

function PlaceSelectCreateItem({ children }: { children: ReactNode }) {
  return (
    <div
      className={`
      h-[32px] grow
      flex items-center gap-[8px]
      text-[14px] font-medium
    `}
    >
      <Plus className="w-[0.75rem] h-[0.75rem]" />
      {children}
    </div>
  );
}

const pages = [
  "calendar",
  "settings",
  "reviews",
  "customers",
  "calls",
  "statistics",
] as const;
export type PlacePage = (typeof pages)[number];

export default async function PlaceNavbar({
  i18n,
  poiid,
}: {
  i18n: i18n;
  poiid: string;
}) {
  const { t } = await useTranslation(i18n, "portal/navbar");
  const auth = await useAuth();

  if (auth.user === null) {
    return redirect(".");
  }

  const places = await getPlacesFromUser(auth.user);
  const images = await Promise.all(
    places.map((place) => getImagesFromPlace(place))
  );
  const selectedPlace = places.find((value) => value.poiid === poiid || value.handle === poiid) as Place;
  return (
    <nav
      className={`
      hidden md:flex flex-col gap-[16px] shrink-0
      w-[250px] lg:w-[300px] p-[16px]
      bg-primary-hover text-neutral-100
    `}
    >
      <_PlaceSelect
        palette="primary"
        itemHeight={32}
        values={
          [
            ...places.map((place, i) => [
              place.poiid,
              <PlaceSelectItem
                key={place.poiid}
                image={images[i][0]}
                place={place}
              />,
            ]),
            [
              "#create",
              <PlaceSelectCreateItem key="#create">
                {t("create")}
              </PlaceSelectCreateItem>,
            ],
          ] as [string, ReactNode][]
        }
        value={selectedPlace.poiid}
      />
      <div role="radiogroup" className="flex flex-1 flex-col gap-[4px]">
        {pages.map((page) => (
          <_PlacePageNav key={page} page={page} poiid={poiid}>
            {t(page)}
          </_PlacePageNav>
        ))}
      </div>
      <_PlaceToggle poiid={poiid} place={selectedPlace} />
    </nav>
  );
}
