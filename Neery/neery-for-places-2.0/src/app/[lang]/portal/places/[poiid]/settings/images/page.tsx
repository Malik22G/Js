import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { Image, getImagesFromPlace } from "@/lib/api/images";
import NextImage from "next/image";
import {
  _DeleteImageButton,
  _ReorderImageButton,
  _UploadImageButton,
} from "./client";
import { PlaceOrID } from "@/lib/api/places";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";

function ImageItem({
  place,
  image,
  i,
  len,
}: {
  place: PlaceOrID;
  image: Image;
  i: number;
  len: number;
}) {
  return (
    <div className="flex gap-[8px] w-full xl:w-3/5 p-[8px] rounded-[8px] border border-neutral-200">
      {len !== -1 ? (
        <div className="flex flex-col shrink-0 items-center justify-evenly gap-[8px]">
          {i !== 0 ? (
            <_ReorderImageButton
              place={place}
              image={image}
              direction={1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}

          {i !== len - 1 ? (
            <_ReorderImageButton
              place={place}
              image={image}
              direction={-1}
              iconClass="h-[1rem] w-[1rem]"
            />
          ) : null}
        </div>
      ) : null}

      <div className="relative h-[100px] w-full">
        <NextImage
          key={image.uuid}
          src={image.url}
          fill
          className="object-cover rounded-[8px]"
          alt="Image"
        />
      </div>

      <div className="flex flex-col shrink-0 items-center justify-evenly gap-[8px]">
        <_DeleteImageButton
          place={place}
          image={image}
          palette="red"
          iconClass="h-[0.7rem] w-[0.7rem]"
        />
      </div>
    </div>
  );
}

export default async function PlaceSettingsImages({
  params: { poiid, lang },
}: {
  params: { poiid: string };
} & LangProps) {
  const [{ t }, images] = await Promise.all([
    loadAndUseTranslation(lang, "portal/settings/images"),
    getImagesFromPlace(poiid),
  ]);

  return (
    <ConfigFormStateless title={t("title")}>
      <_UploadImageButton
        place={poiid}
        palette="secondary"
        className="w-full xl:w-3/5"
      >
        {t("upload")}
      </_UploadImageButton>

      <div className="flex flex-col w-full gap-[8px]">
        {images.map((image, i) => (
          <ImageItem
            key={image.uuid}
            place={poiid}
            image={image}
            i={i}
            len={images.length}
          />
        ))}
      </div>
    </ConfigFormStateless>
  );
}
