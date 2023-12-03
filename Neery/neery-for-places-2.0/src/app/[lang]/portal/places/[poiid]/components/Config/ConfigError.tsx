"use client";

import { Context, useContext } from "react";
import { ConfigFormContextType } from "./ConfigForm";

export default function ConfigError({
  context,
}: {
  context: Context<ConfigFormContextType<any>>,
}) {
  const ctx = useContext(context);
  
  return ctx.error !== undefined ? (
    <p className="text-red">
      {ctx.error}
    </p>
  ) : null;
}
