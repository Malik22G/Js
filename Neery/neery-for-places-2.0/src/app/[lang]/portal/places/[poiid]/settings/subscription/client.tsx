"use client";

//TODO - add translations
import PlanCard from "@/app/[lang]/portal/places/[poiid]/settings/subscription/components/PlanCard";
import {
  getCustomerPortalUrl,
  upgradeSubscriptionFromTrial,
} from "@/lib/api/subscription";
import PlaceSubscriptionInfo from "@/app/[lang]/portal/places/[poiid]/settings/subscription/components/PlaceSubscriptionInfo";
import Button from "@/components/ui/Button";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function _SubscriptionPlans({
  plans,
  currentSubscription,
  currentPlan,
  poiid,
}: {
  plans?: SubscriptionPlan[];
  currentSubscription?: PlaceSubscription;
  currentPlan?: SubscriptionPlan;
  poiid: string;
}) {
  async function handlePlanClick() {
    let url;

    if (
      currentSubscription &&
      currentSubscription.status === "trial" &&
      parseInt(currentSubscription.subscription_tier, 10) < 2
    ) {
      url = await upgradeSubscriptionFromTrial(poiid);
    } else {
      url = await getCustomerPortalUrl(poiid);
    }

    window.location.href = url.url;
  }
  const { t } = useTranslation("portal/settings/subscription");
  return (
    <div className="w-8/12 h-full flex flex-row items-center justify-center flex-wrap">
      {plans?.map((plan, i) => (
        <PlanCard
          key={`plan-${plan.id}`}
          plan={{
            ...plan,
            features: t(`planInfo.${plan.product.name}`, {
              returnObjects: true,
            }) as unknown as { [key: string]: string[] } | string,
          }}
          isCurrent={plan.id === currentPlan?.id}
          isTrial={Boolean(
            currentSubscription && currentSubscription.status === "trial"
          )}
          onSubscribe={handlePlanClick}
        />
      ))}
    </div>
  );
}

export function _PlaceSubscriptionData({
  currentPlan,
  currentSubscription,
  poiid,
}: {
  currentSubscription: PlaceSubscription | undefined;
  currentPlan: SubscriptionPlan | undefined;
  poiid: string;
}) {
  async function handleOpenCustomerPortal() {
    const customerPortalUrl = await getCustomerPortalUrl(poiid);
    window.location.href = customerPortalUrl.url;
  }
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update(null);
  }, []);
  const { t } = useTranslation("portal/settings/subscription");

  if (!currentPlan || !currentSubscription) return null;

  return (
    <div className="flex flex-col w-1/2 md:w-1/8 mx-auto my-2">
      <PlaceSubscriptionInfo
        currentSubscription={currentSubscription}
        currentPlan={currentPlan}
      />
      <Button
        size="medium"
        palette="secondary"
        onClick={handleOpenCustomerPortal}
      >
        {t("changePlan")}
      </Button>
    </div>
  );
}
