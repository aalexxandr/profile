import clsx from "clsx";
import type { ComponentProps } from "react";

type CheckboxOwnProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  type?: "checkbox" | "radio";
};

type CheckboxProps = CheckboxOwnProps &
  Omit<ComponentProps<"input">, keyof CheckboxOwnProps | "children">;

export const Checkbox = ({
  checked,
  className,
  label,
  onChange,
  type = "checkbox",
  ...props
}: CheckboxProps) => (
  <label
    className={clsx(
      "group flex min-h-11 w-fit cursor-pointer items-center gap-2.5 font-vcr text-[14px] text-white uppercase select-none",
      className,
    )}
  >
    <input
      {...props}
      checked={checked}
      className="peer sr-only"
      onChange={(event) => onChange(event.target.checked)}
      type={type}
    />
    <span
      aria-hidden="true"
      className={clsx(
        "flex size-5 shrink-0 items-center justify-center border-[1px_3px_3px_1px] border-solid bg-field transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus-ring motion-reduce:transition-none",
        checked
          ? "border-accent"
          : "border-field-border group-hover:border-accent",
      )}
    >
      <span
        className={clsx("size-2.5 bg-accent", checked ? "block" : "hidden")}
      />
    </span>
    {label}
  </label>
);
