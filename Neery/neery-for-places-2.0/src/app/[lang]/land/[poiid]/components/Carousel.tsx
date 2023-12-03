"use client";
import IconButton from "@/components/ui/IconButton";
import { ArrowLeft, X } from "@/components/ui/icons";
import { Image as ImageType } from "@/lib/api/images";
import Image from "next/image";
import React, { useRef, useState } from "react";

export function Carousel({
  images,
  alt,
}: {
  images: ImageType[];
  alt: string;
}) {
  const [opened, setOpened] = useState(false);
  const [currentImage, setImage] = useState(0);
  return (
    <>
      <div onClick={() => setOpened(true)} className="cursor-pointer">
        {images.length > 0 ? (
          <Image
            src={images[0].url}
            style={{ objectFit: "cover" }}
            fill
            priority
            sizes={`
            (max-width: 767px) 100vw,
            (max-width: 1023px) 80vw,
            60vw
          `}
            alt={alt}
          />
        ) : null}
      </div>
      {opened && (
        <div
          className="fixed flex items-center justify-center top-0 left-0 h-full w-full z-[100] bg-neutral-700/50"
          onClick={() => setOpened(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#ffffff] rounded-3xl shadow-4 py-3 overflow-hidden flex flex-col items-center justify-center w-[100%] lg:w-[900px] h-[90%] "
          >
            <IconButton
              icon={X}
              onClick={() => setOpened(false)}
              palette="red"
              className="absolute shadow-4 z-[50] right-4 top-4"
              size={"large"}
            ></IconButton>
            <IconButton
              icon={ArrowLeft}
              onClick={() =>
                setImage(
                  currentImage - 1 === -1 ? images.length - 1 : currentImage - 1
                )
              }
              className="absolute shadow-4 z-[50] left-4"
              size={"large"}
            ></IconButton>
            <div className="relative flex-1 w-full">
              <Image
                src={images[currentImage].url}
                alt={alt}
                sizes="100vw"
                fill
                style={{ objectFit: "contain" }}
                key={images[currentImage].uuid}
              />
            </div>
            <div className="w-full mt-3 h-[100px] flex flex-row gap-[5px] items-center justify-center overflow-auto">
              {images.map((image, index) => (
                <div key={image.uuid} className="relative w-[100px] h-[100px]">
                  <Image
                    src={image.url}
                    sizes="100vw"
                    alt={alt}
                    fill
                    onClick={() => setImage(index)}
                    className={`rounded-2xl  ${
                      index === currentImage && "border-[3px] !opacity-100"
                    } opacity-50 border-primary cursor-pointer`}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
            <IconButton
              icon={ArrowLeft}
              className="absolute shadow-4 z-[50] right-4 rotate-180"
              size={"large"}
              onClick={() =>
                setImage(
                  currentImage + 1 === images.length ? 0 : currentImage + 1
                )
              }
            ></IconButton>
          </div>
        </div>
      )}
    </>
  );
}
