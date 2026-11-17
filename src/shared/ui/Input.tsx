import clsx from "clsx";
import { type ComponentProps, useId } from "react";

type InputOwnProps = {
  error?: string;
  label: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  value: string;
};

type InputProps = InputOwnProps &
  Omit<
    ComponentProps<"input">,
    keyof InputOwnProps | "children" | "className" | "id" | "ref"
  >;

const fieldClassName = clsx(
  "w-full border-[1px_4px_4px_1px] border-solid bg-field px-4 font-sans text-[14px] text-white transition-colors outline-none placeholder:text-field-label focus-visible:border-accent motion-reduce:transition-none",
);

const validFieldClassName =
  "border-field-border caret-accent hover:border-focus-ring";
const invalidFieldClassName = "border-error caret-error";

export const Input = ({
  error,
  label,
  multiline = false,
  onChange,
  required,
  value,
  ...props
}: InputProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = Boolean(error);
  const sharedProps = {
    "aria-describedby": hasError ? errorId : undefined,
    "aria-invalid": hasError ? true : undefined,
    id,
    required,
    value,
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      <label
        className={clsx(
          "font-vcr text-[12px] uppercase",
          hasError ? "text-error" : "text-field-label",
        )}
        htmlFor={id}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent">
            {" "}
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          {...(props as ComponentProps<"textarea">)}
          {...sharedProps}
          className={clsx(
            fieldClassName,
            "h-28 min-h-16 resize-y py-3",
            hasError ? invalidFieldClassName : validFieldClassName,
          )}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...props}
          {...sharedProps}
          className={clsx(
            fieldClassName,
            "h-12",
            hasError ? invalidFieldClassName : validFieldClassName,
          )}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hasError && (
        <p className="font-vcr text-[12px] text-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};
