import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { en } from "@/shared/i18n-server/dictionaries/en";

import type { ContactFormValues } from "../model/types";
import { ContactTextField } from "./ContactTextField";

const errorTexts = en.pages.contacts.form.errors;

const defaultValues: ContactFormValues = {
  email: "",
  message: "",
  method: "email",
  name: "Alex",
  telegram: "",
};

const setup = (props: Partial<Parameters<typeof ContactTextField>[0]> = {}) => {
  const { result } = renderHook(() =>
    useForm<ContactFormValues>({ defaultValues }),
  );
  const methods = result.current;

  render(
    <FormProvider {...methods}>
      <ContactTextField
        errorTexts={errorTexts}
        label="Your name"
        name="name"
        {...props}
      />
    </FormProvider>,
  );

  return methods;
};

describe("ContactTextField", () => {
  it("labels the field and shows the value of the form", () => {
    setup();

    expect(screen.getByLabelText("Your name")).toHaveValue("Alex");
  });

  it("writes what is typed into the form", async () => {
    const methods = setup();

    await userEvent.type(screen.getByLabelText("Your name"), "B");

    expect(methods.getValues("name")).toBe("AlexB");
  });

  it.each([
    ["name", 100],
    ["email", 100],
    ["telegram", 100],
    ["message", 1000],
  ] as const)("limits %s to %i characters", (name, max) => {
    setup({ name });

    expect(screen.getByLabelText("Your name")).toHaveAttribute(
      "maxlength",
      String(max),
    );
  });

  it("shows the localized text of the field error and exposes it", () => {
    const methods = setup();

    act(() =>
      methods.setError("name", { message: "required", type: "custom" }),
    );

    const field = screen.getByLabelText("Your name");

    expect(field).toBeInvalid();
    expect(field).toHaveAccessibleDescription(errorTexts.required);
  });

  it("ignores an error message that is not a known code", () => {
    const methods = setup();

    act(() =>
      methods.setError("name", { message: "Something else", type: "custom" }),
    );

    expect(screen.getByLabelText("Your name")).not.toHaveAttribute(
      "aria-invalid",
    );
  });

  it("forwards the input attributes", () => {
    setup({ autoComplete: "name", required: true });

    const field = screen.getByLabelText(/Your name/);

    expect(field).toHaveAttribute("autocomplete", "name");
    expect(field).toBeRequired();
  });

  it("renders a textarea when multiline", () => {
    setup({ multiline: true, name: "message" });

    expect(screen.getByLabelText("Your name").tagName).toBe("TEXTAREA");
  });
});
