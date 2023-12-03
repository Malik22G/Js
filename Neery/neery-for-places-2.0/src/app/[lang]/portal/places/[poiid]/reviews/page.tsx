import RatingElement from "@/components/ui/RatingElement";
import { getPlace } from "@/lib/api/places";
import {
  getCustomerFromReview,
  getRatingFromPlace,
  getReviewsFromPlace,
} from "@/lib/api/reviews";
import ReviewCardPlace from "./components/ReviewCardPlace";
import { LangProps } from "@/app/[lang]/props";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import ReviewReplyModal from "./components/ReviewReplyModal";

export default async function PlaceReviews({
  params: { poiid, lang },
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ i18n }, { t }, place, rating, reviews] = await Promise.all([
    loadAndUseTranslation(lang, "translation"),
    loadAndUseTranslation(lang, "portal/reviews"),
    getPlace(poiid),
    getRatingFromPlace(poiid),
    getReviewsFromPlace(poiid),
  ]);

  const customers = await Promise.all(
    reviews.reviews.map(async (x) => ({
      review: x.uuid,
      customer: await getCustomerFromReview(x.poiid, x.uuid),
    }))
  );

  return (
    <ReviewReplyModal>
      <div className="w-full h-full flex flex-col gap-2">
        {/*<h1 className="font-semibold text-[24px] mx-2 mt-2">{t("title")}</h1>*/}

        <div className="w-full flex flex-col items-center lg:items-start lg:flex-row overflow-y-auto">
          <div className="flex flex-col mx-2 my-[16px] p-2 gap-2 rounded-lg min-w-max w-min h-min border border-primary  items-center">
            <p className="">
              Overall rating based on{" "}
              <span className="font-bold text-primary">{reviews.count}</span>{" "}
              ratings
            </p>
            {rating.rating === null ? (
              "No global rating yet!"
            ) : (
              <RatingElement
                rating={rating.rating}
                textStyle="text-primary"
                size="large"
              />
            )}
          </div>

          <div className="w-full flex flex-col h-full gap-2 mx-2 pl-2 lg:mr-0 pr-4 overflow-y-auto">
            {reviews.count > 0 ? (
              <div className="flex flex-col w-full font-work">
                {reviews.reviews
                  .filter((review) => Object.keys(review.review).length > 0)
                  .map((review) => (
                    <ReviewCardPlace
                      key={review.uuid}
                      review={review}
                      customer={
                        customers.find((x) => x.review === review.uuid)
                          ?.customer
                      }
                      place={place}
                      i18n={i18n}
                    />
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ReviewReplyModal>
  );
}
