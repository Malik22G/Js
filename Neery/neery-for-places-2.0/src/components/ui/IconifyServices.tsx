import React, { createElement } from "react";
import { Baby, Cake, Paw, Wheelchair } from "@/components/ui/icons";

function TagIcon({
  icon,
  className,
}: {
  icon: React.FC<{ className: string }>,
  className?: string
}) {

  return (
    <div>
      {createElement(icon, { className: `${className}` })}
    </div>
  );
}

export default function IconifyServices({
  iconTag,
  className,
}: {
  iconTag: string;
  className?: string;
}) {


  if (iconTag === "BRINGPET") {
    return (
      <TagIcon icon={Paw} className={className} />
    );
  }
  if (iconTag === "BABYCHAIR") {
    return (
      <TagIcon icon={Baby} className={className} />
    );
  }
  if (iconTag === "BIRTHDAYCAKE") {
    return (
      <TagIcon icon={Cake} className={className} />
    );
  }
  if (iconTag === "SPECIALNEEDS") {
    return (
      <TagIcon icon={Wheelchair} className={className} />
    );
  }

  return null;
}
