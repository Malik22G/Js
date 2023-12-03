import { ReactNode } from "react";

export default function OnboardingBox({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <div className={`
      col-span-3 lg:col-span-2
      m-3 lg:m-0
      flex items-center justify-center
    `}>
      <div className={`
        w-full lg:w-2/3 overflow-hidden
        font-work
        flex flex-col gap-[8px]
      `}>
        {children}
      </div>
    </div>
  );
}
