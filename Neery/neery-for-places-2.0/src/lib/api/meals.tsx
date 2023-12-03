import { ImagePost, ImagePostResponse } from "./images";
import { MealCategory } from "./mealcategories";
import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export interface CrossPlatformPrice {
  wolt?: number;
  foodpanda?: number;
  inplace?: number;
}

export interface Meal {
  uuid: string;
  poiid: string;
  category: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image_url?: string;
  price: CrossPlatformPrice;
  sales_tax: string;
  alcohol?: string;
  enabled: boolean;
  availability?: [number, number][];
  options: string[];
  rank: number;
  tags: string[];
  featured: boolean;
}

export type MealPost = {
  name: string;
  description?: string;
  price: {
    wolt?: number;
    foodpanda?: number;
    inplace?: number;
  };
  category: string;
  tags?: string[];
  featured?: boolean;
  image_url?: string;
};

export type MealPatch = {
  name?: string;
  description?: string;
  price?: {
    wolt?: number;
    foodpanda?: number;
    inplace?: number;
  };
  category?: string;
  tags?: string[];
  featured?: boolean;
  image_url?: string;
};

export interface Menu {
  meals: Meal[];
  categories: MealCategory[];
}

export type MealOrID = Meal | string;

function mealToID(meal: MealOrID): string {
  if (typeof meal === "string") return meal;
  else return meal.uuid;
}

export async function getMenu(
  place: PlaceOrID,
  options?: FetchOptions
): Promise<Menu> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals`,
    options
  );
}

export async function uploadMenuImage(
  place: PlaceOrID,
  data: ImagePost & { uuid: string },
  options?: FetchOptions
): Promise<ImagePostResponse> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/uploadImage`,
    {
      method: "POST",
      data,
      ...options,
    }
  );
}

export async function createMeal(
  place: PlaceOrID,
  data: MealPost,
  options?: FetchOptions
): Promise<Meal> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/meals`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function reorderMeal(
  place: PlaceOrID,
  meal: MealOrID,
  direction: -1 | 1,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/${encodeURIComponent(
      mealToID(meal)
    )}?direction=${direction}`,
    {
      method: "POST",
      ...options,
    }
  );
}

export async function patchMeal(
  place: PlaceOrID,
  meal: MealOrID,
  data: MealPatch,
  options?: FetchOptions
): Promise<Meal> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/${encodeURIComponent(
      mealToID(meal)
    )}`,
    {
      method: "PATCH",
      data,
      ...options,
    }
  );
}

export async function deleteMeal(
  place: PlaceOrID,
  meal: MealOrID,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/${encodeURIComponent(
      mealToID(meal)
    )}`,
    {
      method: "DELETE",
      ...options,
    }
  );
}

export async function deleteMealImage(
  place: PlaceOrID,
  meal: MealOrID,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/${encodeURIComponent(
      mealToID(meal)
    )}/image`,
    {
      method: "DELETE",
      ...options,
    }
  );
}

export async function uploadWoltMenu(
  place: PlaceOrID,
  menu: string,
  options?: FetchOptions
): Promise<{ ok: true }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(place))}/meals/upload`,
    {
      method: "POST",
      data: menu,
      ...options,
    }
  );
}
