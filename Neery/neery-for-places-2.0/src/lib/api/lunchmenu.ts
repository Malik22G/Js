import { PlaceOrID, placeToID } from "@/lib/api/places";
import { _fetch, FetchOptions } from "@/lib/api/util";
import { ImagePost, ImagePostResponse } from "./images";

export type DailyMenu = {
  menu: string;
  price: number;
  day: number;
  savedFor: Date;
  savedCheck: boolean;
};

export type LunchMenuPost = {
  duration: [number, number];
  image_url: string;
  menus: DailyMenu[];
};

export type LunchMenu = {
  duration: [number, number];
  image_url: string;
  menus: DailyMenu[];
  poiid: string;
  uuid: string;
};

export async function getLunchMenu(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<{ menu: LunchMenu | null }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/lunch`, {
    method: "GET",
    ...options,
  });
}

export async function createLunchMenu(
  place: PlaceOrID,
  data: LunchMenuPost,
  options?: FetchOptions
) {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/lunch`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function deleteLunchImage(
  place: PlaceOrID,
  uuid: string,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/lunch/${encodeURIComponent(
      uuid
    )}/image`,
    {
      method: "DELETE",
      ...options,
    }
  );
}

export async function uploadLunchMenuImage(
  place: PlaceOrID,
  data: ImagePost,
  options?: FetchOptions
): Promise<ImagePostResponse> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/lunch/upload`,
    {
      method: "POST",
      data,
      ...options,
    }
  );
}

export async function patchLunchMenu(
  place: PlaceOrID,
  data: LunchMenu,
  options?: FetchOptions
) {
  const x: LunchMenuPost = {
    duration: data.duration,
    image_url: data.image_url,
    menus: data.menus,
  };

  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/lunch/${encodeURIComponent(
      data.uuid
    )}`,
    {
      method: "PATCH",
      data: x,
      ...options,
    }
  );
}
