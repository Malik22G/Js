import { getAccessFromUser, roleAtLeast } from "@/lib/api/access";
import ConfigLayout from "../components/Config/ConfigLayout";
import { useAuth } from "@/lib/auth/server";
import { ReactNode } from "react";
import { LangProps } from "@/app/[lang]/props";
import ConfigWidget from "../components/Config/ConfigWidget";
import { getPlace } from "@/lib/api/places";

export default async function PlaceSettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { poiid: string; lang: string };
} & LangProps) {
  const auth = await useAuth();
  const access =
    (auth.user !== null && (await getAccessFromUser(auth.user?.uuid))) || null;
  const place = await getPlace(params.poiid);
  const role = access?.find((x) => x.poiid === place.poiid)?.role ?? "WAITER";

  // TODO: This is very ugly an un-React-y. Fix this when we have time.
  const Layout = ConfigLayout(
    [
      ...(roleAtLeast(role, "MANAGER")
        ? [
            "profile",
            "images",
            "reservation",
            "tables",
            "appearance",
            "menu",
            "lunch",
            "widget",
            "calls",
            "access",
          ]
        : []),
      ...(roleAtLeast(role, "OWNER") ? ["subscription"] : []),
    ],
    "portal/settings/navbar"
  );

  return (
    <ConfigWidget poiid={params.poiid} lang={params.lang}>
      {
        /* @ts-expect-error: async component */
        <Layout params={params}>{children}</Layout>
      }
    </ConfigWidget>
  );
}
