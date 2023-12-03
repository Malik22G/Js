"use client";

import {
  BellConceirge,
  Comment,
  Utensils,
  Wallet,
} from "@/components/ui/icons";
import React, { createContext, useContext, useState } from "react";
import Button from "@/components/ui/Button";
import { postReview } from "@/lib/api/reviews";
import TextBox from "@/components/ui/TextBox";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { useTranslation } from "@/app/[lang]/i18n/client";

type ReviewSubmitProps = {
  reviewId: string;
  poiid: string;
};

type ReviewContextType = {
  data: ReviewFormData;
  isMissingField: boolean;
  update: (
    value: string | boolean | number | undefined,
    ratingType: string
  ) => void;
  validate: () => boolean;
};

const ReviewContext = createContext<ReviewContextType>({} as ReviewContextType);

function RateBaseService({
  handleRating,
  icon,
  header,
  className,
}: {
  handleRating: (value: number, ratingType: string) => void;
  icon?: React.FC<{ className: string }>;
  header?: string;
  className?: string;
}) {
  const ctx = useContext(ReviewContext);

  const { data, isMissingField } = ctx;

  const rating =
    data[header?.toLowerCase() as keyof Omit<ReviewFormData, "review">];

  const isMissing = isMissingField && rating === 0;
  const { t } = useTranslation("land");

  return (
    <div className="flex-col mb-4 gap-2">
      <div className="flex mb-2 gap-2 items-center">
        {icon !== undefined
          ? React.createElement(icon, {
              className: `${className}`,
            })
          : null}
        <p className={`${isMissing && "text-red font-semibold"}`}>
          {t("review.howRate")}
          <span className="text-primary">{t(`review.headers.${header}`)}</span>?
          <span className="text-sm">{isMissing && " (required)"}</span>
        </p>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_x, i) => {
          const isValueSelected = rating === i + 1;

          return (
            <Button
              key={`${header}-rating-${i}`}
              palette={isValueSelected ? "primary" : "secondary"}
              size="smallBulky"
              onClick={() =>
                header !== undefined
                  ? handleRating(i + 1, header.toLowerCase())
                  : null
              }
            >
              {i + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function _InfoTag({
  info,
  children,
}: {
  info?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <p className="text-lg">{info}</p>
    </div>
  );
}
const options = ["SearchEngine", "Recommended", "SocialMedia", "Blog", "Other"];
export function _ReviewInputs() {
  const ctx = useContext(ReviewContext);
  const { t } = useTranslation("land");
  return (
    <>
      <RateBaseService
        icon={Utensils}
        header="Food"
        handleRating={ctx.update}
      />
      <RateBaseService
        icon={BellConceirge}
        header="Service"
        handleRating={ctx.update}
      />
      <RateBaseService icon={Wallet} header="Value" handleRating={ctx.update} />

      <div className="flex-col gap-2">
        <p className="mb-1">{t("review.tellMore")}</p>
        <div className="flex w-full gap-2 items-center">
          <Comment />
          <TextBox
            className={"w-full"}
            maxLength={512}
            rows={5}
            wrapperClasses={"w-full mx-auto"}
            value={ctx.data.review}
            onChange={(e) => ctx.update(e.target.value, "review")}
          />
        </div>
      </div>
      <div className="flex-col gap-2 mt-2">
        <p className="mb-1">{t("review.howHear")}</p>
        {options.map((item) => (
          <div className="flex items-center gap-2" key={item}>
            <Input
              type="radio"
              name="option"
              id={item}
              bare
              className="w-auto"
              checked={ctx.data.hearSource === item ? true : false}
              onChange={() => {
                if (ctx.data.hearSource !== "Other") {
                  ctx.update(undefined, "other");
                }
                ctx.update(item, "hearSource");
              }}
            />
            <label htmlFor={item}>{t("review.emailReview." + item)}</label>
            {item === "Other" && ctx.data.hearSource === "Other" && (
              <Input
                placeholder="Specify other option"
                onChange={(e) => ctx.update(e.target.value, "other")}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex-col gap-2">
        <div className="flex-row">
          <Input
            type="checkbox"
            id="isAnonymous"
            bare
            className="mr-2"
            onChange={(e) => ctx.update(e.target.checked, "isAnonymous")}
          />
          <label htmlFor="isAnonymous">{t("review.anonymous")}</label>
          <p>{t("review.anonymousText")}</p>
        </div>
      </div>
    </>
  );
}

export function _ReviewSubmit({ poiid, reviewId }: ReviewSubmitProps) {
  const ctx = useContext(ReviewContext);
  const router = useRouter();
  const { t } = useTranslation("land");

  const { isMissingField } = ctx;

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (ctx.validate()) {
      console.log("Please fill out all the fields!");
      return;
    }

    await postReview(poiid, reviewId, ctx.data);

    return router.refresh();
  }

  return (
    <div className="flex flex-col mt-6 mb-2 justify-center">
      {isMissingField && (
        <p className="text-xs mb-3 text-primary">
          {t("review.completeMandatory")}
        </p>
      )}

      <Button palette="secondary" action={handleSubmit}>
        {t("review.send")}
      </Button>
    </div>
  );
}

export default function ReviewForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    food: 0,
    service: 0,
    value: 0,
    review: "",
  });

  const [isMissingField, setIsMissingField] = useState(false);

  function handleInputChange(
    value: string | boolean | number | undefined,
    ratingType: string
  ) {
    if (isMissingField) setIsMissingField(false);

    setReviewData((prev) => ({
      ...prev,
      [ratingType]: value,
    }));
  }

  function validateReviewForm() {
    const { food, service, value } = reviewData;

    const isMissingField = food === 0 || service === 0 || value === 0;

    if (isMissingField) setIsMissingField(true);

    return isMissingField;
  }

  return (
    <ReviewContext.Provider
      value={{
        data: reviewData,
        isMissingField,
        update: handleInputChange,
        validate: validateReviewForm,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}
