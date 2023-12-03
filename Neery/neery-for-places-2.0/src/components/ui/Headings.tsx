import React from "react";

export function H1({ className, children, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      className={"font-bold text-[24px] md:text-[32px] lg:text-[48px] leading-normal " + (className ?? "")}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      className={"font-semibold text-[18px] md:text-[24px] lg:text-[32px] leading-normal " + (className ?? "")}
      {...props}
    >
      {children}
    </h2>
  );
}
