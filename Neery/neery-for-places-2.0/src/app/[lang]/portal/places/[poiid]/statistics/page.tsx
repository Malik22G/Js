"use client";
import { useTranslation } from "@/app/[lang]/i18n/client";
import React from "react";

import {
  getAcceptedRefused,
  getDaysBreakdown,
  getReservationSourcesBreakdown,
  getReviewSourcesBreakdown,
  getTotalCount,
} from "@/lib/api/statistics";
import { _Graphs } from "./client";

export default async function Statistics({
  params: { poiid },
}: {
  params: { poiid: string };
}) {
  const { t } = useTranslation("portal/statistics");
  const [
    totalCount,
    dailyBreakDown,
    monthlyBreakDown,
    acceptedRejected,
    sourcesBreakdown,
    reviewSourcesBreakdown,
  ] = await Promise.all([
    getTotalCount(poiid),
    getDaysBreakdown(poiid, 7),
    getDaysBreakdown(poiid, 31),
    getAcceptedRefused(poiid),
    getReservationSourcesBreakdown(poiid),
    getReviewSourcesBreakdown(poiid),
  ]);

  return (
    <div className="flex flex-col w-full h-full p-[32px] overflow-auto">
      <h1 className="font-semibold text-[24px] mb-[32px]">{t("title")}</h1>
      {/*<div className=" mb-[32px]">
       {t("subtitle")}
  </div>*/}
      <_Graphs
        {...{
          totalCount,
          dailyBreakDown,
          monthlyBreakDown,
          acceptedRejected,
          sourcesBreakdown,
          reviewSourcesBreakdown,
        }}
      />
    </div>
  );
}
