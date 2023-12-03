import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Image = {
  uuid: string;
  url: string;
  rank: number;
}

export type ImagePost = {
  type: "image/jpeg" | "image/png";
  length: number;
}

export type ImagePostResponse = {
  uuid: string;
  uploadUrl: string;
}

export type ImageOrID = Image | string;

function imageToID(image: ImageOrID): string {
  if (typeof image === "string") return image;
  else return image.uuid;
}

export async function getImagesFromPlace(place: PlaceOrID, options?: FetchOptions): Promise<Image[]> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/images`, options);
}

export async function reorderImage(place: PlaceOrID, image: ImageOrID, direction: -1 | 1, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/images/${encodeURIComponent(imageToID(image))}?direction=${direction}`, {
    method: "PATCH",
    ...options,
  });
}

export async function deleteImage(place: PlaceOrID, image: ImageOrID, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/images/${encodeURIComponent(imageToID(image))}`, {
    method: "DELETE",
    ...options,
  });
}

export async function uploadImage(place: PlaceOrID, post: ImagePost, options?: FetchOptions): Promise<ImagePostResponse> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/images`, {
    method: "POST",
    data: post,
    ...options,
  });
}

export async function finishImage(place: PlaceOrID, image: ImageOrID, options?: FetchOptions): Promise<Image> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(place))}/images/${encodeURIComponent(imageToID(image))}`, {
    method: "POST",
    ...options,
  });
}
