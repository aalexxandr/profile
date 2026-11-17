import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useContactForm } from "./useContactForm";

const submitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.BaseSyntheticEvent;

// Reading `formState.errors` while rendering is what subscribes to them (the
// mounted fields do it in the real form).
const setup = () =>
  renderHook(() => {
    const form = useContactForm();

    return { ...form, errors: form.methods.formState.errors };
  });

type Form = ReturnType<typeof setup>["result"];

const codes = (form: Form) =>
  Object.fromEntries(
    Object.entries(form.current.errors).map(([field, error]) => [
      field,
      error?.message,
    ]),
  );

const submit = async (form: Form, event = submitEvent()) => {
  await act(async () => {
    await form.current.submit(event);
  });
};

const fill = (form: Form, values: Record<string, string>) => {
  act(() => {
    for (const [field, value] of Object.entries(values)) {
      form.current.methods.setValue(field as "name", value);
    }
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useContactForm", () => {
  it("starts empty with Email selected, without errors and without the notice", () => {
    const { result } = setup();

    expect(result.current.methods.getValues()).toEqual({
      email: "",
      message: "",
      method: "email",
      name: "",
      telegram: "",
    });
    expect(codes(result)).toEqual({});
    expect(result.current.isSent).toBe(false);
  });

  it("prevents the native submit", async () => {
    const { result } = setup();
    const event = submitEvent();

    await submit(result, event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("gives the schema error codes for an invalid form and shows no notice", async () => {
    const { result } = setup();

    await submit(result);

    expect(codes(result)).toEqual({
      email: "required",
      message: "required",
      name: "required",
    });
    expect(result.current.isSent).toBe(false);
  });

  it("reports an invalid email", async () => {
    const { result } = setup();

    fill(result, { email: "abc", message: "Hello", name: "Alex" });
    await submit(result);

    expect(codes(result)).toEqual({ email: "invalidEmail" });
  });

  it("validates the Telegram value, not the email, for Telegram", async () => {
    const { result } = setup();

    fill(result, { method: "telegram" });
    await submit(result);

    expect(codes(result)).toEqual({
      message: "required",
      name: "required",
      telegram: "required",
    });
  });

  it("keeps both contact values when the method changes", () => {
    const { result } = setup();

    fill(result, { email: "a@b.co" });
    fill(result, { method: "telegram" });
    fill(result, { telegram: "@alex" });
    fill(result, { method: "email" });

    expect(result.current.methods.getValues()).toMatchObject({
      email: "a@b.co",
      telegram: "@alex",
    });
  });

  it("keeps what was typed when the form is invalid", async () => {
    const { result } = setup();

    fill(result, { name: "Alex" });
    await submit(result);

    expect(result.current.methods.getValues("name")).toBe("Alex");
  });

  it("clears the fields, returns to Email and shows the notice for a valid form", async () => {
    const { result } = setup();

    fill(result, { email: "a@b.co", message: "Hello", name: "Alex" });
    fill(result, { method: "telegram" });
    fill(result, { telegram: "@alex" });
    await submit(result);

    expect(result.current.methods.getValues()).toEqual({
      email: "",
      message: "",
      method: "email",
      name: "",
      telegram: "",
    });
    expect(codes(result)).toEqual({});
    expect(result.current.isSent).toBe(true);
  });

  it("sends nothing anywhere", async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    const { result } = setup();

    fill(result, { email: "a@b.co", message: "Hello", name: "Alex" });
    await submit(result);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
