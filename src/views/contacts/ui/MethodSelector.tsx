"use client";

import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

import { Checkbox } from "@/shared/ui";

import type { ContactFormValues, ContactMethod } from "../model/types";

type MethodOption = {
  label: string;
  value: ContactMethod;
};

type MethodSelectorProps = {
  legend: string;
  options: MethodOption[];
};

export const MethodSelector = ({ legend, options }: MethodSelectorProps) => {
  const groupName = useId();
  const { clearErrors } = useFormContext<ContactFormValues>();
  const { field } = useController<ContactFormValues, "method">({
    name: "method",
  });

  const select = (method: ContactMethod) => {
    field.onChange(method);
    // A contact error of the field that was hidden would show up again when
    // the visitor switches back.
    clearErrors(["email", "telegram"]);
  };

  return (
    <fieldset className="flex min-w-0 flex-col gap-1 border-0 p-0">
      <legend className="mb-1.5 font-vcr text-[12px] text-field-label uppercase">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-x-6">
        {options.map((option) => (
          <Checkbox
            checked={field.value === option.value}
            key={option.value}
            label={option.label}
            name={groupName}
            onChange={() => select(option.value)}
            type="radio"
          />
        ))}
      </div>
    </fieldset>
  );
};
