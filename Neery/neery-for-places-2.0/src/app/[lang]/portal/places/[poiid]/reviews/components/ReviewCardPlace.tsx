
import RatingElement from "@/components/ui/RatingElement";
import { BellConceirge, Utensils, Wallet, Person, Calendar, Clock } from "@/components/ui/icons";
import { Place } from "@/lib/api/places";
import { Customer, Review, ReviewObject } from "@/lib/api/reviews";
import { i18n } from "i18next";
import ReplyButton from "./ReplyButton";

function caclulateNeeryScore(reviewObject: ReviewObject) {
  let neeryScore = 0;

  {/**TODO */ }
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

export default function ReviewCardPlace({
  review,
  customer,
  i18n,
}: {
  review: Review,
  place: Place
  customer?: Customer,
  i18n: i18n,
}) {
  return (
    <div className="flex-col border-b border-b-neutral-200">
      <div className="flex items-center py-3 gap-3">
        {/*icon ? icon : defaulticon*/}
        <div className="relative h-[3rem] w-[3rem] flex-shrink-0 rounded-full bg-primary-gradient p-1">
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 align-middle text-neutral-100 text-2xl uppercase">{review.name[0]}</p>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2 font-bold mb-1 md:mb-2 items-center">
            {review.name}
            {<div className="flex gap-4 font-normal items-center">

              {customer !== undefined ? (
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <Person />
                    {customer.count}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar />
                    {new Date(customer.date).toLocaleDateString(i18n.language)}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock />
                    {new Date(customer.date).toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit"})}
                  </div>
                </div>) : null}
              
              <ReplyButton review={review} />
            </div>}
          </div>
          <div className="flex gap-2 mb-1 md:mb-2">
            <RatingElement rating={caclulateNeeryScore(review.review)} />
            {new Date(review.created_at).toLocaleDateString(i18n.language)}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <Utensils />
              {review.review.food !== undefined ? <RatingElement rating={review.review.food} starsOnly /> : "No value given"}
            </div>
            <div className="flex gap-2">
              <BellConceirge />
              {review.review.service !== undefined ? <RatingElement rating={review.review.service} starsOnly /> : "No value given"}
            </div>
            <div className="flex gap-2">
              <Wallet />
              {review.review.value !== undefined ? <RatingElement rating={review.review.value} starsOnly /> : "No value given"}
            </div>
          </div>
          <div>
            {review.review.review}
          </div>
        </div>
      </div>

      {review.reply ? (
        <div className="ml-[3.75rem] pl-[1rem] mb-4 border-l border-neutral-200">
          <p className="font-bold">Válasz a helytől</p>
          <p>{review.reply}</p>
        </div>
      ) : null}
    </div>
  );
}
