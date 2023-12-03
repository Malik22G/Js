"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/client";
import { Stage, StageData, stageComponents, stages } from "./stages";
import { PlacePost, PlacePostSchema, postPlace } from "@/lib/api/places";
import { wme2osm } from "@/lib/wme";
import ajv from "@/lib/ajv";
import { useRouter } from "next/navigation";

function dataToPost(data: StageData): Partial<PlacePost> {
  return {
    ...data,
    opening: data.opening !== undefined ? wme2osm(data.opening) : undefined,
  };
}

export default function PortalOnboarding() {
  const router = useRouter();
  const auth = useAuth();

  const defaultData: StageData = {
    ownerName: auth.user?.name,
    opening: [
      [480, 1200-1],
      [1920, 2640-1],
      [3360, 4080-1],
      [4800, 5520-1],
      [6240, 6960-1],
    ],
    granularity: 15,
    deadline: 60,
    maxCount: 10,
    maxDistance: 60,
    defaultLength: 120,
    maxLength: 300,
    autotable: 1,
  };

  const [stage, setStage] = useState<Stage>(stages[0]);
  const [data, setData] = useState<StageData>(defaultData);
  const [post, setPost] = useState<Partial<PlacePost>>(dataToPost(data));
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    const post = dataToPost(data);
    setPost(post);
    setValid(ajv.validate(PlacePostSchema, post));
  }, [data]);

  return (
    <div className={`
      w-full h-full
      bg-neutral-100
      grid grid-cols-3
    `}>
      {React.createElement(stageComponents[stage], {
        data,
        setData: cng => setData(data => ({ ...data, ...cng })),
        next: (
          stages.indexOf(stage) === stages.length - 1
            ? (async () => { // Submit
              const place = await postPlace(post as PlacePost);
              router.push(`/portal/places/${encodeURIComponent(place.poiid)}`);
            })
            : (() => { // Advance
              setStage(stages[stages.indexOf(stage) + 1]);
            })
        ),
        back: () => setStage(stages[Math.max(stages.indexOf(stage) - 1, 0)]),
        reset: () => setData(defaultData),
        valid,
      })}
    </div>
  );
}
