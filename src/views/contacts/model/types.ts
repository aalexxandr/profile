import type * as z from "zod/mini";

import type { Dictionary } from "@/shared/i18n";

import type { contactSchema } from "./contactSchema";

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactMethod = ContactFormValues["method"];

export type ContactFieldName = Exclude<keyof ContactFormValues, "method">;

export type ContactFieldError = "invalidEmail" | "required" | "tooLong";

export type ContactFormErrors = Partial<
  Record<ContactFieldName, ContactFieldError>
>;

export type ContactErrorTexts =
  Dictionary["pages"]["contacts"]["form"]["errors"];
