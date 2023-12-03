import { InfoCircle } from "@/components/ui/icons";
import IconButton from "@/components/ui/IconButton";
import React, { useContext } from "react";
import { ClosedEvent } from "@/lib/api/closedevents";
import { ClosedEventModalContext, closedEventToData } from "./ClosedEventModal";
import { useTranslation } from "@/app/[lang]/i18n/client";

export function EventListCard({ event }: { event: ClosedEvent }) {
  const eventCtx = useContext(ClosedEventModalContext);
  const { t } = useTranslation("portal/calendar");

  return (
    <div className="w-full flex flex-col border rounded-lg border-red bg-red/25 px-4 py-2 m-2">
      <div className="w-full flex flex-row justify-between gap-2 items-center">
        <div className="flex flex-row min-w-fit">
          {new Date(event.date).toLocaleTimeString(/*i18n.language*/ [], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(event.endDate).toLocaleTimeString(/*i18n.language*/ [], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <span className="line-clamp-1">
          {t("event")} {event.internal_comment && `- ${event.internal_comment}`}
        </span>

        <div className="md:w-1/12 flex flex-row justify-between">
          <IconButton
            icon={InfoCircle}
            className="pointer-events-auto"
            iconClass="w-[3rem] h-[3rem]"
            size="xlarge"
            action={() => eventCtx.update(closedEventToData(event))}
          />
        </div>
      </div>
    </div>
  );
}
