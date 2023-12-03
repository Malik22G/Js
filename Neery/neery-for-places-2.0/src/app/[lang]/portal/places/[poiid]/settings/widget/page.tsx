import { LangProps } from "@/app/[lang]/props";
import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { HandleForm, IFrames, LandURL } from "./client";
import { getPlace } from "@/lib/api/places";
import { InfoCircle } from "@/components/ui/icons";

export default async function PlaceSettingsWidget({
  params,
}: {
  params: { poiid: string };
} & LangProps) {
  const place = await getPlace(params.poiid);
  return (
    <ConfigFormStateless title="Widget">
      <div className="flex flex-row items-center gap-2">
        <InfoCircle className="text-primary" />
        <a href="https://docs.neery.net/SystemDescription/Settings/widgets.html" target="_blank" className="text-primary">NeerY docs</a>
      </div>
      <LandURL poiid={params.poiid} />
      <HandleForm place={place} />
      <IFrames place={place} />
    </ConfigFormStateless>
  );
}
