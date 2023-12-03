import Input, { InputProps } from "@/components/ui/Input";
import { ReactNode } from "react";

export function OnboardingSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans font-medium text-[18px] mt-[1rem] first:mt-0">{children}</h2>
  );
}

export function OnboardingInputRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-row md:grid-flow-col gap-2 w-full">{children}</div>
  );
}

export function OnboardingInput({
  className,
  ...props
}: InputProps) {
  return (
    <Input
      className={`
        invalid:border-red ${className ?? ""}
      `}
      {...props}
    />
  );
}
