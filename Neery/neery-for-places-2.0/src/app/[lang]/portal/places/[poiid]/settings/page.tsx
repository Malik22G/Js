import { redirect } from "next/navigation";

export default async function PlaceSettings({
  params,
}: {
  params: { poiid: string },
}) {
  return redirect(`/portal/places/${encodeURIComponent(params.poiid)}/settings/profile`);
}
