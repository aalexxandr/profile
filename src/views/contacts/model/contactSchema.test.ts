import { describe, expect, it } from "vitest";
import { type input, safeParse } from "zod/mini";

import { MAX_FIELD_LENGTH, MAX_MESSAGE_LENGTH } from "../config";
import { contactSchema } from "./contactSchema";

type Values = input<typeof contactSchema>;

const validValues = {
  email: "a@b.co",
  message: "Hello",
  method: "email",
  name: "Alex",
  telegram: "",
} satisfies Values;

// First message per field, like the form shows it.
const errorsOf = (values: Record<string, unknown>) => {
  const result = safeParse(contactSchema, { ...validValues, ...values });

  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);

    errors[field] ??= issue.message;
  }

  return errors;
};

describe("contactSchema", () => {
  it("accepts a valid form", () => {
    expect(safeParse(contactSchema, validValues).success).toBe(true);
  });

  it("requires the name, the email and the message", () => {
    expect(errorsOf({ email: "", message: "", name: "" })).toEqual({
      email: "required",
      message: "required",
      name: "required",
    });
  });

  it("treats whitespace-only values as empty", () => {
    expect(errorsOf({ message: "   ", name: "  " })).toEqual({
      message: "required",
      name: "required",
    });
  });

  it("reports an invalid email", () => {
    expect(errorsOf({ email: "abc" })).toEqual({ email: "invalidEmail" });
  });

  it.each(["a..b@c.com", ".a@b.com", "a@-b.com", "юзер@пример.рф"])(
    "rejects the malformed address %s with the strict email rule",
    (email) => {
      expect(errorsOf({ email })).toEqual({ email: "invalidEmail" });
    },
  );

  it.each(["alex.m+tag@gmail.com", "x@sub.domain.io", "a'b@c.com"])(
    "accepts the ordinary address %s",
    (email) => {
      expect(errorsOf({ email })).toEqual({});
    },
  );

  it("reports only `required` for an empty email, not also an invalid one", () => {
    const result = safeParse(contactSchema, { ...validValues, email: "" });
    const emailIssues = result.success
      ? []
      : result.error.issues.filter((issue) => issue.path[0] === "email");

    expect(emailIssues.map((issue) => issue.message)).toEqual(["required"]);
  });

  it("requires the Telegram value instead of the email for Telegram", () => {
    expect(errorsOf({ email: "", method: "telegram", telegram: "" })).toEqual({
      telegram: "required",
    });
  });

  it("accepts any non-empty Telegram value and ignores the email", () => {
    expect(
      errorsOf({ email: "abc", method: "telegram", telegram: "@alex" }),
    ).toEqual({});
  });

  it("ignores the Telegram value for Email", () => {
    expect(errorsOf({ method: "email", telegram: "" })).toEqual({});
  });

  it("rejects an unknown method", () => {
    expect(
      safeParse(contactSchema, { ...validValues, method: "phone" }).success,
    ).toBe(false);
  });

  describe("limits", () => {
    it.each([
      ["name", MAX_FIELD_LENGTH],
      ["message", MAX_MESSAGE_LENGTH],
    ])(
      "accepts %s up to the limit and reports tooLong beyond it",
      (field, max) => {
        expect(errorsOf({ [field]: "a".repeat(max) })).toEqual({});
        expect(errorsOf({ [field]: "a".repeat(max + 1) })).toEqual({
          [field]: "tooLong",
        });
      },
    );

    it("limits the Telegram value", () => {
      expect(
        errorsOf({
          method: "telegram",
          telegram: "a".repeat(MAX_FIELD_LENGTH + 1),
        }),
      ).toEqual({ telegram: "tooLong" });
    });

    it("limits the email", () => {
      const email = `${"a".repeat(MAX_FIELD_LENGTH)}@b.co`;

      expect(errorsOf({ email })).toEqual({ email: "tooLong" });
    });
  });
});
