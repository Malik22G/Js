"use client";
import type { Customer } from "@/lib/api/reviews";
import { _InfoTag } from "@/app/[lang]/land/[poiid]/review/[reviewid]/client";
import { Calendar, Clock, Person } from "@/components/ui/icons";
import type React from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";

type CustomerReviewCardProps = {
  customer: Customer;
  children?: React.ReactNode;
};

export default function CustomerReviewCard({
  customer,
  children,
}: CustomerReviewCardProps) {
  const { placeName, customerName, count, date } = customer;
  const { t } = useTranslation("land");

  return (
    <div className="flex-col shadow-2 w-11/12 sm:w-[500px] rounded-lg px-4 py-4">
      <div className="mt-2 mb-4">
        <p className="text-lg mb-2">
          Dear
          <span className="text-primary font-bold ">{" " + customerName}</span>,
        </p>
        <p>{t("review.thankTaking")}</p>

        <div className="flex-col my-4 rounded-lg p-2 ">
          <p className="flex justify-center text-xl text-primary">
            {placeName}
          </p>
          <div className="flex mt-2 gap-3 justify-center">
            <_InfoTag info={`${count}`}>
              <Person className="text-primary h-[1.5rem] w-[1.5rem]" />
            </_InfoTag>
            <_InfoTag
              info={new Date(date).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            >
              <Calendar className="text-primary h-[1.5rem] w-[1.5rem]" />
            </_InfoTag>
            <_InfoTag
              info={new Date(date).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            >
              <Clock className="text-primary h-[1.5rem] w-[1.5rem]" />
            </_InfoTag>
          </div>
        </div>
      </div>
      <div className="flex-col gap-2">{children}</div>
    </div>
  );
}
