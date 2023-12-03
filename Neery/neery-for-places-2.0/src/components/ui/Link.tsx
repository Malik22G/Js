import { GenericClickable, GenericClickableProps } from "./util";

export default function Link({
  children,
  className: _className,
  ...props
}: GenericClickableProps) {
  return (
    <GenericClickable
      className={`${_className} text-blue text-semibold`}
      {...props}
    >
      {children}
    </GenericClickable>
  );
}
