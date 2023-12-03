"use client";

import IconButton from "@/components/ui/IconButton";
import { Comment } from "@/components/ui/icons";
import { Review } from "@/lib/api/reviews";
import { useContext } from "react";
import { ReviewReplyModalContext } from "./ReviewReplyModal";

export default function ReplyButton({
  review,
}: {
  review: Review,
}) {
  const rctx = useContext(ReviewReplyModalContext);

  return (
    <IconButton
      icon={Comment}
      iconClass="h-[0.75rem] w-[0.75rem]"
      action={() => rctx.update(review)}
    />
  );
}
