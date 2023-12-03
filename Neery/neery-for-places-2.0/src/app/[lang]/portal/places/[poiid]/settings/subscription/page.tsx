import { LangProps } from "@/app/[lang]/props";
import { getAccessFromUser, roleAtLeast } from "@/lib/api/access";
import { useAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import {
  getCurrentSubscription,
  getSubscriptionPlans,
} from "@/lib/api/subscription";
import {
  _PlaceSubscriptionData,
  _SubscriptionPlans,
} from "@/app/[lang]/portal/places/[poiid]/settings/subscription/client";
import { getPlace } from "@/lib/api/places";

export default async function PlaceSubscription({
  params,
}: {
  params: { poiid: string };
} & LangProps) {
  const auth = await useAuth();
  
  const [{ t }, place, selfAcci] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/subscription"),
    getPlace(params.poiid),
    getAccessFromUser(auth.user?.uuid ?? ""),
  ]);

  const self = selfAcci.find((x) => x.poiid === place.poiid);

  if (self === undefined || !roleAtLeast(self.role, "OWNER")) {
    return redirect(".");
  }

  const currentSubscription = await getCurrentSubscription(params.poiid);
  const plans = await getSubscriptionPlans();

  const currentPlan = plans?.find(
    (plan) => plan.product.tier === currentSubscription.subscription_tier
  );

  return (
    <div className="h-fit font-work flex flex-col gap-[32px] grow">
      <h2 className="font-sans font-semibold text-[24px]">{t("title")}</h2>
      <div className="flex w-full mx-auto flex-col xl:flex-row items-center xl:items-start">
        <_PlaceSubscriptionData
          currentSubscription={currentSubscription}
          currentPlan={currentPlan}
          poiid={params.poiid}
        />
        <_SubscriptionPlans
          plans={plans}
          currentSubscription={currentSubscription}
          currentPlan={currentPlan}
          poiid={params.poiid}
        />
      </div>
    </div>
  );
}
