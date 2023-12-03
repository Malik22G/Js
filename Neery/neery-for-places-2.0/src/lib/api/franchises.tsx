import { Place } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Franchise = {
  poiid: string;
  name: string;
  owner: string;
  places: Place[];
}

export async function getFranchise(poiid: string, options?: FetchOptions): Promise<Franchise> {
  return await _fetch(`/franchises/${poiid}`, options);
}
