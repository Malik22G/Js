"use client";

import {
  InputContainer,
  InputLabel,
} from "@/app/[lang]/land/[poiid]/reserve/components/Reserve/screens/ReserveDate/kit";
import Input from "@/components/ui/Input";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { ReactNode, useContext, useEffect, useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { atime } from "@/lib/atime";
import {
  ClosedEvent,
  ClosedEventPatch,
  ClosedEventPost,
  deleteClosedEvent,
  patchClosedEvent,
  postClosedEvent,
} from "@/lib/api/closedevents";
import { useTranslation } from "@/app/[lang]/i18n/client";
import ModalError from "@/components/ui/Modal/ModalError";
import { errorHandler } from "@/components/ui/Modal/ModalError";
import { Place } from "@/lib/api/places";
import UnderTierBadge from "../../components/UnderTierBadge";
export type ClosedEventModalData = {
  uuid?: string;
  poiid: string;
  data: ClosedEventPatch;
};

export function closedEventToData({
  uuid,
  poiid,
  ...data
}: ClosedEvent): ClosedEventModalData {
  return {
    uuid,
    poiid,
    data,
  };
}

export const ClosedEventModalContext =
  createModalContext<ClosedEventModalData>();

export function localISOString(n: number | undefined): string {
  if (n === undefined) return "";

  let d = new Date(n);

  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function ClosedEventModalInside({
  onChange,
  place,
}: {
  onChange(): void;
  place: Place;
}) {
  let ctx = useContext(ClosedEventModalContext);
  let d: ClosedEventModalData = ctx.data ?? { poiid: "", data: {} };
  const { t } = useTranslation("portal/calendar");
  const [showExt, setExt] = useState(false);
  useEffect(() => {
    setExt(d.data.external_comment ? true : false);
  }, [d.data]);
  return (
    <>
      <ModalTitle context={ClosedEventModalContext}>
        {ctx.data?.uuid ? t("modifyEvent") : t("createEvent")}
      </ModalTitle>

      <InputContainer>
        <InputLabel>{t("from")}</InputLabel>

        <Input
          type="datetime-local"
          value={localISOString(d.data.date)}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                date: new Date(e.target.value).valueOf(),
              },
            })
          }
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("to")}</InputLabel>

        <Input
          type="datetime-local"
          value={localISOString(d.data.endDate)}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                endDate: new Date(e.target.value).valueOf(),
              },
            })
          }
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>{t("internalComment")}</InputLabel>

        <Input
          type="text"
          value={d.data.internal_comment ?? ""}
          onChange={(e) =>
            ctx.update({
              ...d,
              data: {
                ...d.data,
                internal_comment: e.target.value,
              },
            })
          }
        />
      </InputContainer>

      <Input
        type="checkbox"
        checked={showExt ?? false}
        label="Comment for customers"
        rootClassName="!flex-row p-2 gap-[5px]"
        onChange={(e) => {
          setExt(e.target.checked);
          if (!e.target.checked) {
            ctx.update({
              ...d,
              data: {
                ...d.data,
                external_comment: undefined,
              },
            });
          }
        }}
      />
      {showExt && (
        <InputContainer>
          <InputLabel>{t("externalComment")}</InputLabel>
          <Input
            type="text"
            value={d.data.external_comment ?? ""}
            onChange={(e) =>
              ctx.update({
                ...d,
                data: {
                  ...d.data,
                  external_comment: e.target.value,
                },
              })
            }
          />
        </InputContainer>
      )}

      <Input
        type="checkbox"
        label="Block times"
        rootClassName="!flex-row p-2 gap-[5px]"
        checked={d.data.is_blocking}
        onChange={(e) =>
          ctx.update({
            ...d,
            data: {
              ...d.data,
              is_blocking: e.target.checked,
            },
          })
        }
      />

      <ModalError context={ClosedEventModalContext} />

      {place.tier >= 1 ? (
        <>
          {d.uuid !== undefined ? (
            <LoadingButton
              palette="red"
              className="mt-[8px]"
              action={async () => {
                if (d.uuid === undefined) return;

                await errorHandler(
                  deleteClosedEvent(d.poiid, d.uuid),
                  ctx.setError
                );

                onChange();
                ctx.update(null);
                await atime(250);
              }}
            >
              {t("delete")}
            </LoadingButton>
          ) : null}

          <LoadingButton
            palette="secondary"
            className={d.uuid === undefined ? "mt-[8px]" : ""}
            disabled={d.data.date === undefined || d.data.endDate === undefined}
            action={async () => {
              if (
                d.data.date !== undefined &&
                d.data.endDate !== undefined &&
                d.data.date > d.data.endDate
              ) {
                ctx.setError(t("invalidDateRange"));
              } else {
                if (d.uuid !== undefined) {
                  await errorHandler(
                    patchClosedEvent(d.poiid, d.uuid, d.data),
                    ctx.setError
                  );
                } else {
                  await errorHandler(
                    postClosedEvent(d.poiid, d.data as ClosedEventPost),
                    ctx.setError
                  );
                }
                onChange();
                ctx.update(null);
                await atime(250);
              }
            }}
          >
            {d.uuid !== undefined ? t("modify") : t("create")}
          </LoadingButton>
        </>
      ) : (
        <UnderTierBadge place={place} />
      )}
    </>
  );
}

export default function ClosedEventModal({
  children,
  onChange,
  place,
}: {
  children: ReactNode;
  onChange(): void;
  place: Place;
}) {
  return (
    <ModalBox<ClosedEventModalData>
      context={ClosedEventModalContext}
      siblings={children}
    >
      <ClosedEventModalInside onChange={onChange} place={place} />
    </ModalBox>
  );
}
