import { PlaceOrID, placeToID } from "./places";
import { FetchOptions, _fetch } from "./util";

export type Customer = {
  uuid: string;
  phone: string;
  email: string;
  name?: string;
  comment?: string;
  visits: number;
}

export type CustomerPatch = {
  comment?: string;
}

export type CustomerOrID = Customer | string;

function customerToID(customer: CustomerOrID): string {
  if (typeof customer === "string") {
    return customer;
  } else {
    return customer.uuid;
  }
}

export async function getCustomers(place: PlaceOrID, options?: FetchOptions): Promise<Customer[]> {
  return await _fetch(`/places/${placeToID(place)}/customers`, options);
}

export async function getCustomer(place: PlaceOrID, customer: CustomerOrID, options?: FetchOptions): Promise<Customer> {
  return await _fetch(`/places/${placeToID(place)}/customers/${customerToID(customer)}`, options);
}

export async function patchCustomer(place: PlaceOrID, customer: CustomerOrID, data: CustomerPatch, options?: FetchOptions): Promise<Customer> {
  return await _fetch(`/places/${placeToID(place)}/customers/${customerToID(customer)}`, {
    method: "PATCH",
    data,
    ...options,
  });
}
