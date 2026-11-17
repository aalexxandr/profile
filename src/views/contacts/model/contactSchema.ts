// Only `zod/mini` is imported: classic `zod` is far larger in the client bundle.
import * as z from "zod/mini";

import { MAX_FIELD_LENGTH, MAX_MESSAGE_LENGTH } from "../config";

// The messages are error codes, not texts: the UI turns them into the
// localized dictionary texts (see `getFieldErrorText`).
const text = (max: number) =>
  z
    .string()
    .check(z.trim(), z.minLength(1, "required"), z.maxLength(max, "tooLong"));

// `pipe` stops at the first failure, so an empty email only reports `required`.
const email = z.pipe(text(MAX_FIELD_LENGTH), z.email("invalidEmail"));

const common = {
  message: text(MAX_MESSAGE_LENGTH),
  name: text(MAX_FIELD_LENGTH),
};

// Only the contact field of the chosen method is checked; the other one may
// hold anything the visitor typed before switching.
export const contactSchema = z.discriminatedUnion("method", [
  z.object({
    ...common,
    email,
    method: z.literal("email"),
    telegram: z.string(),
  }),
  z.object({
    ...common,
    email: z.string(),
    method: z.literal("telegram"),
    telegram: text(MAX_FIELD_LENGTH),
  }),
]);
