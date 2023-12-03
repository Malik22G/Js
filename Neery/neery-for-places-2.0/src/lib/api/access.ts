import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export const accessRoles = ["WAITER", "MANAGER", "OWNER"] as const;
export type AccessRole = typeof accessRoles[number];

export function roleAtLeast(x: AccessRole, a: AccessRole): boolean {
  return accessRoles.indexOf(x) >= accessRoles.indexOf(a);
}

export type Access = {
  poiid: string;
  userId: string;
  role: AccessRole;
}

export type AccessPost = {
  email: string;
  role: AccessRole;
}

export type AccessPatch = {
  userId: string;
  role: AccessRole;
}

export type AccessDelete = {
  userId: string;
}

export async function getAccessFromUser(userId: string, options?: FetchOptions): Promise<Access[]> {
  return await _fetch(`/users/${userId}/access`, options);
}

export async function getAccess(place: PlaceOrID, options?: FetchOptions): Promise<Access[]> {
  return await _fetch(`/places/${placeToID(place)}/access`, options);
}

export async function createAccess(place: PlaceOrID, data: AccessPost, options?: FetchOptions): Promise<Access> {
  return await _fetch(`/places/${placeToID(place)}/access`, {
    method: "POST",
    data,
    ...options,
  });
}

export async function patchAccess(place: PlaceOrID, data: AccessPatch, options?: FetchOptions): Promise<Access> {
  return await _fetch(`/places/${placeToID(place)}/access`, {
    method: "PATCH",
    data,
    ...options,
  });
}

export async function deleteAccess(place: PlaceOrID, data: AccessDelete, options?: FetchOptions): Promise<{ ok: true }> {
  return await _fetch(`/places/${placeToID(place)}/access`, {
    method: "DELETE",
    data,
    ...options,
  });
}
