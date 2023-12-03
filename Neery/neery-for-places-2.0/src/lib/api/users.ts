import { Place } from "./places";
import { FetchOptions, _fetch } from "./util";

export type UserOrID = User | string;

export type User = {
  uuid: string;
  permission?: string[];
  name?: string;
  picture?: string;
}

export function userToID(user: UserOrID): string {
  if (typeof user === "string") return user;
  else return user.uuid;
}

export async function getUser(user: UserOrID, options?: FetchOptions): Promise<User> {
  return await _fetch(`/users/${encodeURIComponent(userToID(user))}`, options);
}

export async function getPlacesFromUser(user: UserOrID, options?: FetchOptions): Promise<Place[]> {
  return await _fetch(`/users/${encodeURIComponent(userToID(user))}/places`, options);
}
