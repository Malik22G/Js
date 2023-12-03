"use client";

import Input from "@/components/ui/Input";
import LoadingButton from "@/components/ui/LoadingButton";
import ModalBox from "@/components/ui/Modal/ModalBox";
import { createModalContext } from "@/components/ui/Modal/ModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { atime } from "@/lib/atime";
import { ReactNode, useContext } from "react";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Review, patchReview } from "@/lib/api/reviews";
import { useRouter } from "next/navigation";
import ModalError, { errorHandler } from "@/components/ui/Modal/ModalError";

export const ReviewReplyModalContext = createModalContext<Review>();

function ReviewReplyModalInside({ onChange }: { onChange(): void }) {
  const ctx = useContext(ReviewReplyModalContext);

  const { t } = useTranslation("portal/reviews/reply");

  return (
    <>
      <ModalTitle context={ReviewReplyModalContext}>{t("title")}</ModalTitle>

      <Input
        label={t("reply")}
        value={ctx.data?.reply ?? ""}
        onChange={(e) =>
          ctx.data
            ? ctx.update({
                ...ctx.data,
                reply: e.target.value,
              })
            : null
        }
      />
      <ModalError context={ReviewReplyModalContext} />

      <LoadingButton
        className="mt-[8px] shrink-0"
        palette="secondary"
        action={async () => {
          if (!ctx.data) return;

          await errorHandler(
            patchReview(ctx.data.poiid, ctx.data, {
              reply: ctx.data.reply ?? "",
            }),
            ctx.setError
          );

          onChange();
          ctx.update(null);
          await atime(250);
        }}
      >
        {t("send")}
      </LoadingButton>
    </>
  );
}

export default function ReviewReplyModal({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <ModalBox<Review> context={ReviewReplyModalContext} siblings={children}>
      <ReviewReplyModalInside onChange={() => router.refresh()} />
    </ModalBox>
  );
}
