import { redirect } from "next/navigation";

import { useAuth } from "@/lib/auth/server";

export default async function PortalPlaceLanding({ params }: { params: { poiid: string } }) {
  const auth = await useAuth();

  if (auth.user !== null) {
    redirect(`/portal/places/${encodeURIComponent(params.poiid)}/calendar`);
  } else {
    redirect("/");
  }
}
