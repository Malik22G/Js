import React from "react";
import { CheckCircle } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

type PlanCardProps = {
  plan: SubscriptionPlan & { features: { [key: string]: string[] } | string };
  onSubscribe: () => void;
  isCurrent: boolean;
  isTrial: boolean;
};

export default function PlanCard({
  plan,
  onSubscribe,
  isCurrent,
  isTrial,
}: PlanCardProps) {
  const cardClasses = `w-2/12 min-w-[350px] h-[600px] min-h-[400px] flex flex-col justify-between items-center my-8 border shadow-md rounded-xl p-4 mx-6 ${
    isCurrent ? "border-primary" : "border-neutral-300"
  }`;

  const { product, unit_amount, currency, features, recurring } = plan;
  const { name } = product;
  const isArray = Array.isArray(features);
  return (
    <div className={cardClasses}>
      <div className="flex flex-col items-center">
        <div className="text-xl mx-auto my-4 font-semibold text-primary">
          {name}
        </div>
        <div className="">{`${unit_amount / 100} ${currency.toUpperCase()} / ${
          recurring.interval ?? "month"
        }`}</div>
      </div>
      <ul {...(isArray && { className: "list-disc text-sm px-3" })}>
        {typeof features !== "string" &&
          Object.keys(features).map((info, i) => {
            return (
              <li key={`feature ${i}`}>
                <div className="font-[500]">{info}</div>

                {!isArray && (
                  <ul className="list-disc text-sm px-3">
                    {(features[info] as string[]).map((info, i) => (
                      <li key={`feature ${i}`}>{info}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>
      <div>
        {isCurrent ? (
          <div className="flex flex-col items-center justify-center">
            {isTrial && (
              <div className="font-semibold">{"Free 20 days trial"}</div>
            )}
            {React.createElement(CheckCircle, {
              className: "text-primary my-4",
            })}
          </div>
        ) : (
          <Button
            size="large"
            palette="secondary"
            onClick={() => onSubscribe()}
          >
            {"Change plan"}
          </Button>
        )}
      </div>
    </div>
  );
}
