import { _fetch } from "@/lib/api/util";
import { PlaceOrID, placeToID } from "./places";

export async function getSubscriptionPlans(): Promise<
  SubscriptionPlan[] | undefined
  > {
  return await _fetch("/plans");
}

export async function getCurrentSubscription(poiid: PlaceOrID): Promise<PlaceSubscription> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(poiid))}/payment`);
}

export async function getCustomerPortalUrl(poiid: PlaceOrID): Promise<{ url: string }> {
  return await _fetch(
    `/places/${encodeURIComponent(placeToID(poiid))}/payment/customerportal`
  );
}

export async function upgradeSubscriptionFromTrial(poiid: PlaceOrID): Promise<{ url: string }> {
  return await _fetch(`/places/${encodeURIComponent(placeToID(poiid))}/payment/upgrade`);
}
