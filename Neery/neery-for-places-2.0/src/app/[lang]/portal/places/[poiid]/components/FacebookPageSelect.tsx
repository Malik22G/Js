import { FacebookLink } from "@/lib/api/places";
import FacebookLogin from "./FacebookLogin";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "@/components/ui/Select";

interface FacebookPage {
  access_token: string;
  category: string;
  category_list: {
    id: string,
    name: string,
  }[],
  name: string,
  id: string,
  tasks: string[],
}

export default function FacebookPageSelect({
  value,
  setValue,
}: {
  value: Partial<FacebookLink>,
  setValue: Dispatch<SetStateAction<Partial<FacebookLink>>>,
}) {
  const [facebookPages, setFacebookPages] = useState<FacebookPage[] | null>(null);

  useEffect(() => {
    (async () => {
      if (value.accessToken && facebookPages === null) {
        const req = await fetch(`https://graph.facebook.com/me/accounts?access_token=${encodeURIComponent(value.accessToken)}`);
        const res: {data: FacebookPage[]} = await req.json();
        setFacebookPages(res.data);
      }
    })();
  }, [value.accessToken, facebookPages]);

  return value.accessToken === undefined ? (
    <FacebookLogin
      setAccess={access => {
        setValue({
          accessToken: access.accessToken,
        });
      }}
    />
  ) : facebookPages === null ? (
    <span>Loading...</span>
  ) : (
    <Select<string | null>
      className="w-full"
      value={value.pageId ?? null}
      setValue={pageId => {
        setValue(valueId => ({
          ...valueId,
          pageId: pageId ?? undefined,
        }));
      }}
      values={[
        [null, "Select a place..."],
        ...(facebookPages.map(x => [x.id, x.name] as const) as [string | null, string][]),
      ]}
    />
  );
}
