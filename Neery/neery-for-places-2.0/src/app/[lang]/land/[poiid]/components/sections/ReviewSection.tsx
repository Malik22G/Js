import { i18n } from "i18next";

import { H2 } from "@/components/ui/Headings";
import { useTranslation } from "@/app/[lang]/i18n";
import { Place } from "@/lib/api/places";
import ReviewCard from "../ReviewCard";
import { Rating, Review } from "@/lib/api/reviews";
import RatingElement from "@/components/ui/RatingElement";
import { BellConceirge, Utensils, Wallet } from "@/components/ui/icons";

export default function ReviewSection({
  i18n,
  rating,
  reviews,
}: {
  i18n: i18n;
  place: Place;
  rating: Rating;
  reviews: { count: number; reviews: Review[] };
}) {
  const { t } = useTranslation(i18n, "land", { keyPrefix: "reviews" });
  const reviewsToShow = 5;

  if (reviews.count > 0) {
    return (
      <>
        <div className="flex-col gap-[24px] mx-[24px] md:mx-0">
          <H2>
            {t("title")} <span className="">({reviews.count})</span>
          </H2>
          {rating.rating === null ? (
            "No global rating yet!"
          ) : (
            <div className="grid grid-cols-2 gap-y-[16px] md:flex gap-[24px] items-center">
              <RatingElement rating={rating.rating} size="large" />

              {rating.food !== null ? (
                <div className="flex gap-[8px] items-center">
                  <Utensils className="h-[1rem] w-[1rem]" />
                  <RatingElement rating={rating.food} size="small" />
                </div>
              ) : null}

              {rating.service !== null ? (
                <div className="flex gap-[8px] items-center">
                  <BellConceirge className="h-[1rem] w-[1rem]" />
                  <RatingElement rating={rating.service} size="small" />
                </div>
              ) : null}

              {rating.value !== null ? (
                <div className="flex gap-[8px] items-center">
                  <Wallet className="h-[1rem] w-[1rem]" />
                  <RatingElement rating={rating.value} size="small" />
                </div>
              ) : null}
            </div>
          )}
          <div className="flex flex-col w-full font-work">
            {reviews.reviews
              .filter((review) => Object.keys(review.review).length > 0)
              .slice(0, reviewsToShow)
              .map((review) => (
                <ReviewCard key={review.uuid} review={review} i18n={i18n} />
              ))}
          </div>
        </div>
      </>
    );
  } else return null;
}
