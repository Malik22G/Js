import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export interface MealCategory {
  uuid: string;
  poiid: string;
  name: Record<string, string>;
  description: Record<string, string>;
  availability?: [number, number][];
  rank: number;
}

export type MealCategoryPost = {
  name: string;
  description?: string;
}

export type MealCategoryPatch = {
  name?: string;
  description?: string;
}

export type MealCategoryOrID = MealCategory | string;

function categoryToID(category: MealCategoryOrID): string {
  if (typeof category === "string") return category;
  else return category.uuid;
}

export async function createCategory(place: PlaceOrID, data: MealCategoryPost, options?: FetchOptions): Promise<MealCategory> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/meals/categories`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function reorderCategory(place: PlaceOrID, category: MealCategoryOrID, direction: -1 | 1, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/meals/categories/${encodeURIComponent(categoryToID(category))}?direction=${direction}`, {
    method: "POST",
    ...options,
  });
}

export async function patchCategory(place: PlaceOrID, category: MealCategoryOrID, data: MealCategoryPatch, options?: FetchOptions): Promise<MealCategory> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/meals/categories/${encodeURIComponent(categoryToID(category))}`, {
    method: "PATCH",
    data,
    ...options,
  });
}

export async function deleteCategory(place: PlaceOrID, category: MealCategoryOrID, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/meals/categories/${encodeURIComponent(categoryToID(category))}`, {
    method: "DELETE",
    ...options,
  });
}
