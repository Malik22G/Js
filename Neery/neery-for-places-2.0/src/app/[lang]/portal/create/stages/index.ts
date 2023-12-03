import { PlacePost } from "@/lib/api/places";

import StageBasics from "./StageBasics";
import StageUseful1 from "./StageUseful1";
// import StageUseful2 from "./StageUseful2";
import StageReservation from "./StageReservation";

export const stages = ["basics", "useful1", /* "useful2", */ "reservation"] as const;
export type Stage = typeof stages[number];

export type StageData = Omit<Partial<PlacePost>, "opening" | "autotable"> & {
  opening: [number, number][],
  autotable: number,
}

export type StageProps = {
  data: StageData,
  setData(cng: Partial<StageData>): void,
  next(): void,
  back(): void,
  reset(): void,
  valid: boolean,
}

export const stageComponents: { [S in Stage]: React.FC<StageProps> } = {
  basics: StageBasics,
  useful1: StageUseful1,
  // useful2: StageUseful2,
  reservation: StageReservation,
};
