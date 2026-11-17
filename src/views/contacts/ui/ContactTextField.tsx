"use client";

import type { ComponentProps } from "react";
import { useController } from "react-hook-form";

import { Input } from "@/shared/ui";

import { getFieldErrorText } from "../lib/getFieldErrorText";
import { getFieldLimit } from "../lib/getFieldLimit";
import type {
  ContactErrorTexts,
  ContactFieldName,
  ContactFormValues,
} from "../model/types";

type ContactTextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "error" | "maxLength" | "name" | "onChange" | "value"
> & {
  errorTexts: ContactErrorTexts;
  name: ContactFieldName;
};

// A text field of the contact form: it reads and writes the surrounding form
// by itself and gets the length limit and the error text from the field name.
export const ContactTextField = ({
  errorTexts,
  name,
  ...inputProps
}: ContactTextFieldProps) => {
  const { field, fieldState } = useController<
    ContactFormValues,
    ContactFieldName
  >({ name });

  return (
    <Input
      {...inputProps}
      error={getFieldErrorText(fieldState.error?.message, errorTexts, name)}
      maxLength={getFieldLimit(name)}
      name={field.name}
      onChange={field.onChange}
      value={field.value}
    />
  );
};
