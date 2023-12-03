"use client";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Duration } from "luxon";

type PlaceSubscriptionInfoProps = {
  currentSubscription: PlaceSubscription;
  currentPlan: SubscriptionPlan;
};

export default function PlaceSubscriptionInfo({
  currentSubscription: sub,
  currentPlan: plan,
}: PlaceSubscriptionInfoProps) {
  const { i18n } = useTranslation("translation");
  const { t } = useTranslation("portal/settings/subscription");

  const isTrial = sub.status === "trial";

  return (
    <>
      <div className="flex flex-col w-full my-2">
        <div className="text-lg font-semibold text-primary">
          {t("currentPackage")}
        </div>
        <div className="ml-4 mt-2 text-base">
          {isTrial ? (t("freeTrial")) : plan.product.name}
        </div>
      </div>
      {isTrial ? (
        <div className="flex flex-col w-full my-2">
          <div className="text-lg font-semibold text-primary">
            {t("trialEnds")}
          </div>
          <div className="ml-4 mt-2 text-base">
            {
              Duration.fromMillis(
                (sub.subscription_end - sub.subscription_start) * 1000,
                { locale: i18n.language }
              )
                .shiftTo("days")
                .toHuman()
            }
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full my-2">
            <div className="text-lg font-semibold text-primary">
              {t("nextPayment")}
            </div>
            <div className="ml-4 mt-2 text-base">
              {new Date(sub.subscription_end * 1000).toLocaleDateString(i18n.language)}
            </div>
          </div>
          {sub.last_payment_date && (
            <div className="flex flex-col w-full my-2">
              <div className="text-lg font-semibold text-primary">
                {t("lastPayment")}
              </div>

              <div className="ml-4 mt-2 text-base">
                {new Date(sub.last_payment_date * 1000).toLocaleDateString(i18n.language)}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
