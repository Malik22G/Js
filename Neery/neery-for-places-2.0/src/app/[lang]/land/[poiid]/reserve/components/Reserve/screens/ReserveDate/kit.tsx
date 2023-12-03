import { ReactNode, useEffect, useState } from "react";

export function InputContainer({
  className = "flex justify-between items-center",
  children,
}: {
  className?: string,
  children: ReactNode,
}) {
  return (
    <div className={`
      p-[12px]
      border border-neutral-300 rounded-[8px]
      font-medium leading-mobile
      ${className}
    `}>
      {children}
    </div>
  );
}

export function InputLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-semibold">
      {children}
    </span>
  );
}

export function useDateDate(date: Date | null): Date | null {
  const [dateDate, setDateDate] = useState(date !== null ? new Date(date) : null);

  useEffect(() => {
    setDateDate(dateDate => {
      if (date?.toDateString() !== dateDate?.toDateString()) {
        return date !== null ? new Date(date) : null;
      }

      return dateDate;
    });
  }, [date]);

  return dateDate;
}
