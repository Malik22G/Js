import { ReactNode, useContext, useRef, useState } from "react";
import { OnboardingModalContext } from "../OnboardingModalContext";
import ModalTitle from "@/components/ui/Modal/ModalTitle";
import { GenericClickable } from "@/components/ui/util";
import { Libraries, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useTranslation } from "@/app/[lang]/i18n/client";
import { Min, wme2osm } from "@/lib/wme";
import Input from "@/components/ui/Input";
import FacebookPageSelect from "@/app/[lang]/portal/places/[poiid]/components/FacebookPageSelect";
import { FacebookLink } from "@/lib/api/places";

const googleMapsLibraries: Libraries = ["places"];

function ConnectModule({
  children,
  name,
  checked,
  className,
  boxClassName,
}: {
  children: ReactNode,
  name: string,
  checked: boolean,
  className?: string,
  boxClassName?: string,
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col shadow-2">
      <GenericClickable
        className={`
          bg-neutral-100 rounded-xl border
          flex items-center justify-center py-[4px]
          font-semibold transition-all
          hover:text-neutral-100
          aria-expanded:text-neutral-100
          aria-expanded:rounded-b-none
          aria-checked:text-neutral-100
          ${!open ? "delay-150" : ""}
          ${className ?? ""}
        `}
        aria-expanded={open}
        aria-checked={checked}
        action={() => setOpen(x => !x)}
      >
        {name}
      </GenericClickable>

      <div
        className={`
          w-full bg-red/25 p-[0px] rounded-b-xl
          overflow-hidden max-h-[0px]
          aria-expanded:max-h-[300px] aria-expanded:p-[8px]
          transition-all
          ${boxClassName ?? ""}
        `}
        aria-expanded={open}
      >
        {children}
      </div>
    </div>
  );
}

export default function OnboardingScreenConnect() {
  const ctx = useContext(OnboardingModalContext);
  const { i18n } = useTranslation("landing/auth");
  const searchBox = useRef<google.maps.places.SearchBox | null>(null);
  const [mapsChecked, setMapsChecked] = useState<boolean>(false);
  const [facebookLink, setFacebookLink] = useState<Partial<FacebookLink>>({});

  return (
    <>
      <ModalTitle context={OnboardingModalContext} className="pt-[0px] pb-[0px]">
        Felületek összekapcsolása
      </ModalTitle>

      <p className="text-[14px] mb-[8px]">Minél több éttermi felületeddel kötöd össze a NeerY-t, annál gyorsabban tudsz regisztrálni, és annál több funkcionalitás lesz elérhető a NeerY-n.</p> 

      <ConnectModule
        name="Google Maps"
        checked={mapsChecked}
        className="border-brands-google text-brands-google hover:bg-brands-google/80 aria-expanded:bg-brands-google aria-checked:bg-brands-google"
        boxClassName="bg-brands-google/25"
      >
        <LoadScript
          googleMapsApiKey="AIzaSyCfQo6W4aDZc67xjSJ59kRauxJHyKE-XSI"
          language={i18n.language}
          libraries={googleMapsLibraries}
        >
          <StandaloneSearchBox
            onLoad={box => {
              searchBox.current = box;
            }}
            onUnmount={() => {
              searchBox.current = null;
            }}
            onPlacesChanged={() => {
              const place = (searchBox.current?.getPlaces() ?? [])[0] ?? null;

              if (place !== null) {
                const opening = ((place as any).current_opening_hours as google.maps.places.PlaceOpeningHours | undefined)?.periods?.map(period =>
                  [period.open, period.close ?? period.open].map(x =>
                    Min.fromParams(
                      (x.day + 7 - 1) % 7,
                      x.hours ?? parseInt(x.time.slice(0, 2), 10),
                      x.minutes ?? parseInt(x.time.slice(2), 10)
                    )
                  ) as [number, number]
                );

                ctx.update({
                  ...(ctx.data ?? {}),
                  addressCountry: place.address_components?.find(x => x.types.includes("country"))?.long_name,
                  addressCity: place.address_components?.find(x => x.types.includes("locality"))?.long_name,
                  addressLine: [
                    place.address_components?.find(x => x.types.includes("route"))?.long_name,
                    place.address_components?.find(x => x.types.includes("street_number"))?.long_name,
                  ].filter(x => x).join(" "),
                  addressCounty: place.address_components?.find(x => x.types.includes("administrative_area_level_2"))?.long_name,
                  addressState: place.address_components?.find(x => x.types.includes("administrative_area_level_1"))?.long_name,
                  addressZip: place.address_components?.find(x => x.types.includes("postal_code"))?.long_name,
                  latitude: place.geometry?.location?.lat(),
                  longitude: place.geometry?.location?.lng(),
                  placePhone: place.international_phone_number,
                  placeWebsite: place.website,
                  opening: opening !== undefined ? wme2osm(opening) : undefined,
                });

                setMapsChecked(true);
              } else {
                setMapsChecked(false);
              }
            }}
          >
            <Input
              type="text"
              placeholder="Search..."
              className="w-full"
            />
          </StandaloneSearchBox>
        </LoadScript>
      </ConnectModule>

      <ConnectModule
        name="Facebook Page"
        checked={facebookLink.pageId !== undefined}
        className="border-brands-facebook text-brands-facebook hover:bg-brands-facebook/80 aria-expanded:bg-brands-facebook aria-checked:bg-brands-facebook"
        boxClassName="bg-brands-facebook/25"
      >
        <FacebookPageSelect
          value={facebookLink}
          setValue={setFacebookLink}
        />
      </ConnectModule>
    </>
  );
}
