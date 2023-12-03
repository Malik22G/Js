import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import Button from "@/components/ui/Button";

export default function ResultScreen({
  image,
  imageAlt,
  title,
  text,
  showButton,
  button,
  action,
}: {
  image: StaticImageData,
  imageAlt: string,
  title: string | ReactNode,
  text: string | ReactNode,
  showButton: boolean,
  button: string | ReactNode,
  action(): any,
}) {
  return (
    <div
      className={`
        w-full p-[24px]
        flex flex-col gap-[16px] items-center justify-center
        text-center text-[14px]
      `}
    >
      <Image
        src={image}
        alt={imageAlt}
        height={240}
        className="rounded-[16px]"
      />

      <h2 className="text-[18px] font-semibold">{title}</h2>
      <p>{text}</p>

      {showButton ? (
        <Button
          palette="primary"
          size="large"
          action={action}
        >
          {button}
        </Button>
      ) : null}
    </div>
  );
}
