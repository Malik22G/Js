import { ReactNode } from "react";

export default function Labelled({
  label,
  labelId,
  error,
  children,
  className,
}: {
  label?: string | ReactNode;
  labelId?: string;
  error?: string | ReactNode;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={`
      flex flex-col gap-[4px]
      text-[14px] leading-[18px] font-work font-regular
      ${className}
    `}
    >
      {label !== undefined ? <span id={labelId}>{label}</span> : null}

      {children}

      {error !== undefined ? <span className="text-red">{error}</span> : null}
    </div>
  );
}
