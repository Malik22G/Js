"use client";

import { ButtonButtonProps } from "@/components/ui/Button";
import IconButton, { IconButtonButtonProps } from "@/components/ui/IconButton";
import LoadingButton from "@/components/ui/LoadingButton";
import { ArrowLeft, X } from "@/components/ui/icons";
import {
  Image,
  deleteImage,
  finishImage,
  reorderImage,
  uploadImage,
} from "@/lib/api/images";
import { PlaceOrID } from "@/lib/api/places";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { ClosedWidgetContext } from "../../components/Config/ConfigWidget";

export function _UploadImageButton({
  place,
  children,
  ...props
}: Omit<ButtonButtonProps, "action"> & {
  place: PlaceOrID;
}) {
  const router = useRouter();
  const [promise, setPromise] = useState<((x: unknown) => void) | undefined>(
    undefined
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const wtx = useContext(ClosedWidgetContext);
  useEffect(() => {
    wtx.update({ key: 1 });
  }, []);
  return (
    <>
      <LoadingButton
        {...props}
        action={() => {
          if (inputRef.current !== null) {
            inputRef.current.click();
            return new Promise((resolve) => setPromise(resolve));
          }
        }}
      >
        {children}
      </LoadingButton>

      <input
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        ref={inputRef}
        onChange={async (e) => {
          const file = (e.target.files ?? [])[0];

          if (file !== undefined) {
            const uploadData = await uploadImage(place, {
              type: file.type as "image/jpeg" | "image/png",
              length: file.size,
            });

            const awsUpload = await fetch(uploadData.uploadUrl, {
              method: "PUT",
              mode: "cors",
              body: file,
            });

            if (awsUpload.status >= 400) {
              const err = {
                status: awsUpload.status,
                body: await awsUpload.text(),
              };

              try {
                const jsonBody = JSON.parse(err.body);
                if (jsonBody) {
                  err.body = jsonBody;
                }
              } catch (_) {}

              throw err;
            }

            await finishImage(place, uploadData.uuid);

            if (promise !== undefined) {
              promise(null);
            }
            router.refresh();
            wtx.data?.key && wtx.update({ key: wtx.data?.key + 1 });
          }
        }}
      />
    </>
  );
}

export function _ReorderImageButton({
  place,
  image,
  direction,
  iconClass,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  place: PlaceOrID;
  image: Image;
  direction: -1 | 1;
}) {
  const router = useRouter();

  return (
    <IconButton
      icon={ArrowLeft}
      action={async () => {
        await reorderImage(place, image, direction);
        router.refresh();
      }}
      iconClass={`${iconClass ?? ""} ${
        direction === 1 ? "rotate-90" : "-rotate-90"
      }`}
      {...props}
    />
  );
}

export function _DeleteImageButton({
  place,
  image,
  iconClass,
  ...props
}: Omit<IconButtonButtonProps, "icon" | "action"> & {
  place: PlaceOrID;
  image: Image;
}) {
  const router = useRouter();

  return (
    <IconButton
      icon={X}
      action={async () => {
        await deleteImage(place, image);
        router.refresh();
      }}
      iconClass={`${iconClass ?? ""}`}
      {...props}
    />
  );
}
