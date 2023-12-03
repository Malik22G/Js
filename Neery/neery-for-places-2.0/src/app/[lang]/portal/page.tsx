import { getPlacesFromUser } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function PortalLanding() {
  const auth = await useAuth();

  if (auth.user !== null) {
    const places = await getPlacesFromUser(auth.user);
    if (places.length > 0) {
      redirect(`/portal/places/${encodeURIComponent(places[0].poiid)}/calendar`);
    } else {
      redirect("/portal/create");
    }
  } else {
    redirect("/");
  }
}
