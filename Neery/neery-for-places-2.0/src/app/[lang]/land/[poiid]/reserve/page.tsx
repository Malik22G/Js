import { getPlace } from "@/lib/api/places";
import Reserve from "./components/Reserve";
import Image from "next/image";
import { getImagesFromPlace } from "@/lib/api/images";
import { cookies } from "next/headers";

export default async function LandReserve({
  params,
}: {
  params: { poiid: string };
}) {
  const [place, images] = await Promise.all([
    getPlace(params.poiid),
    getImagesFromPlace(params.poiid),
  ]);

  return (
    <main className="w-full h-full">
      {(images && images[0]) ? (
        <div className="w-full h-[240px] md:h-full fixed">
          <Image
            src={images[0].url}
            style={{ objectFit: "cover" }}
            fill
            priority
            sizes="100vw"
            alt={place.name}
          />
        </div>
      ) : null}

      <div
        className={`
        rounded-t-[32px] md:rounded-[16px]
        absolute left-0 right-0 top-[52px]
        md:left-[20%] md:right-[20%]
        bg-neutral-100 md:shadow-2

        flex min-h-[calc(100%-52px)] md:min-h-min
      `}
      >
        <Reserve
          place={place}
          fullscreen={true}
        />
      </div>
    </main>
  );
}
