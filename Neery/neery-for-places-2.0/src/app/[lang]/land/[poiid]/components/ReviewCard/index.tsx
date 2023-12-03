
import { useTranslation } from "@/app/[lang]/i18n";
import RatingElement from "@/components/ui/RatingElement";
import { Review, ReviewObject } from "@/lib/api/reviews";
import { i18n } from "i18next";

function caclulateNeeryScore(reviewObject: ReviewObject) {
  let neeryScore = 0;

  // TODO
  let divider = 0;
  let divident = 0;

  if (reviewObject.food !== undefined) {
    divident += reviewObject.food;
    divider++;
  }
  if (reviewObject.value !== undefined) {
    divident += reviewObject.value;
    divider++;
  }
  if (reviewObject.service !== undefined) {
    divident += reviewObject.service;
    divider++;
  }

  if (divider > 0) {
    neeryScore = divident / divider;
  }

  return neeryScore;
}

export default function ReviewCard({
  review,
  i18n,
}: {
  review: Review,
  i18n: i18n,
}) {
  const { t } = useTranslation(i18n, "land", { keyPrefix: "reviews" });

  return (
    <div className="flex flex-col border-b border-b-neutral-200">
      <div className="flex items-center py-3 gap-3">
        {/*icon ? icon : defaulticon*/}
        <div className="relative h-[3rem] w-[3rem] flex-shrink-0 rounded-full bg-primary-gradient p-1">
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 align-middle text-neutral-100 text-2xl uppercase">{review.name[0]}</p>
        </div>
        <div className="flex flex-col">
          <div className="font-bold mb-1 md:mb-2">
            {review.name}
          </div>
          <div className="flex gap-2 mb-1 md:mb-2">
            <RatingElement rating={caclulateNeeryScore(review.review)} />
            {new Date(review.created_at).toLocaleDateString(i18n.language)}
          </div>
          <div className="">
            {review.review.review}
          </div>
        </div>
      </div>
      {review.reply ? (
        <div className="ml-[3.75rem] pl-[1rem] mb-4 border-l border-neutral-200">
          <p className="font-bold">{t("reply")}</p>
          <p>{review.reply}</p>
        </div>
      ) : null}
    </div>
  );
}
