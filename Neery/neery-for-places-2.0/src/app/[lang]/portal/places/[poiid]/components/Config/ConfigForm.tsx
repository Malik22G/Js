"use client";

import { Context, ReactNode, createContext, useEffect, useState } from "react";
import isEqual from "lodash.isequal";

export type ConfigFormContextType<K> = {
  form: K;
  update(form: Partial<K>): void;
  error: string | undefined;
  setError(error: string | undefined): void;
};

export function createFormContext<K>(
  defaultForm: K
): Context<ConfigFormContextType<K>> {
  return createContext<ConfigFormContextType<K>>({
    form: defaultForm,
    update(_form) {
      console.warn("Placeholder ConfigFormContextType.update called!");
    },
    error: undefined,
    setError(_error) {
      console.warn("Placeholder ConfigFormContextType.setError called!");
    },
  });
}

type ConfigFormStatelessProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  widget?: boolean;
};

export function ConfigFormStateless({
  title,
  description,
  children,
  className,
}: ConfigFormStatelessProps) {
  return (
    <div
      className={`h-fit font-work flex flex-row flex-1 ` + (className ?? "")}
    >
      <div className="flex-1 flex flex-col gap-[32px] grow">
        {title || description ? (
          <div>
            {title ? (
              <h2 className="font-sans font-semibold text-[24px]">{title}</h2>
            ) : null}
            {description ? <p>{description}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
      <div className="w-[450px] hidden 2xl:block"></div>
    </div>
  );
}

export default function ConfigForm<C>({
  context,
  defaultForm,
  children,
  ...props
}: ConfigFormStatelessProps & {
  context: Context<ConfigFormContextType<C>>;
  defaultForm: {
    form: C;
    time: number;
  };
}) {
  const [form, setForm] = useState<C>(defaultForm.form);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setForm(defaultForm.form);
  }, [defaultForm]);

  return (
    <context.Provider
      value={{
        form,
        update(f) {
          setForm((form) => {
            const ef = Object.entries(f);
            if (ef.length === 0) return form;
            if (ef.every(([k, v]) => isEqual(v, (form as any)[k]))) return form;

            return {
              ...form,
              ...f,
            };
          });
        },
        error,
        setError,
      }}
    >
      <ConfigFormStateless {...props}>{children}</ConfigFormStateless>
    </context.Provider>
  );
}
