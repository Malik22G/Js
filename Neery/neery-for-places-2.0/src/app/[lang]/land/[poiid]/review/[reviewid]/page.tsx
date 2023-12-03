import { getCustomerFromReview, getReview } from "@/lib/api/reviews";
import ReviewForm, { _ReviewInputs, _ReviewSubmit } from "./client";
import React from "react";
import CustomerReviewCard from "@/app/[lang]/land/[poiid]/review/[reviewid]/components/CustomerReviewCard";
import { LangProps } from "@/app/[lang]/props";
import PoweredBy from "@/components/ui/PoweredBy";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";

export default async function ReviewLand({
  params: { poiid, reviewid: reviewId, lang },
}: {
  params: {
    poiid: string;
    reviewid: string;
  };
} & LangProps) {
  const [existingReview, reviewCustomerData] = await Promise.all([
    getReview(poiid, reviewId),
    getCustomerFromReview(poiid, reviewId),
  ]);
  const { t } = await loadAndUseTranslation(lang, "land");
  if (existingReview && existingReview.review) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center w-full h-full text-primary font-bold text-xl text-center">
        <p className="w-2/3">{t("review.thankYou")}</p>
        <PoweredBy />
      </div>
    );
  }

  if (!reviewCustomerData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center justify-center shadow-2 rounded-lg text-primary font-bold text-xl w-4/12 h-[300px] text-center">
          ERROR: Could not load review for this reservation
        </div>
      </div>
    );
  }

  return (
    <ReviewForm>
      <div className="flex h-full w-full justify-center items-center">
        <CustomerReviewCard customer={reviewCustomerData}>
          <_ReviewInputs />
          <_ReviewSubmit poiid={poiid} reviewId={reviewId} />
        </CustomerReviewCard>
      </div>
    </ReviewForm>
  );
}
