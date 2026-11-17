import type { ContactErrorTexts, ContactFieldName } from "../model/types";
import { getFieldLimit } from "./getFieldLimit";

// `error` is the message of the field error as the form gives it: the schema
// error code. Anything else is ignored.
export const getFieldErrorText = (
  error: string | undefined,
  texts: ContactErrorTexts,
  field: ContactFieldName,
) => {
  if (error === "tooLong") {
    return texts.tooLong.replace("{max}", String(getFieldLimit(field)));
  }

  if (error === "required" || error === "invalidEmail") {
    return texts[error];
  }

  return undefined;
};
