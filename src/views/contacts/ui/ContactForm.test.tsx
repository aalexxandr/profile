import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { locales } from "@/shared/i18n";
import { en } from "@/shared/i18n-server/dictionaries/en";
import { ru } from "@/shared/i18n-server/dictionaries/ru";

import { ContactForm } from "./ContactForm";

const formByLocale = { en: en.pages.contacts.form, ru: ru.pages.contacts.form };

const getFields = (form: typeof en.pages.contacts.form) => ({
  email: screen.getByLabelText(new RegExp(form.emailLabel)),
  message: screen.getByLabelText(new RegExp(form.messageLabel)),
  name: screen.getByLabelText(new RegExp(form.nameLabel)),
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each(locales)("ContactForm in %s", (locale) => {
  const form = formByLocale[locale];

  it("shows the name, the methods with Email selected, the email and the message", () => {
    render(<ContactForm form={form} />);

    const fields = getFields(form);

    expect(fields.name).toBeVisible();
    expect(fields.email).toBeVisible();
    expect(fields.message).toBeVisible();
    expect(
      screen
        .getAllByRole("radio")
        .map((radio) => radio.closest("label")?.textContent),
    ).toEqual([form.methods.email, form.methods.telegram]);
    expect(
      screen.getByRole("radio", { name: form.methods.email }),
    ).toBeChecked();
    expect(screen.queryByLabelText(form.usernameLabel)).not.toBeInTheDocument();
  });

  it("puts the fields in order: name, method, contact, message", () => {
    render(<ContactForm form={form} />);

    const fields = getFields(form);
    const method = screen.getByRole("radio", { name: form.methods.email });
    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

    expect(follows(fields.name, method)).toBe(true);
    expect(follows(method, fields.email)).toBe(true);
    expect(follows(fields.email, fields.message)).toBe(true);
  });

  it("replaces the email field with the Telegram field in place", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByText(form.methods.telegram));

    expect(screen.getByLabelText(new RegExp(form.usernameLabel))).toBeVisible();
    expect(
      screen.queryByLabelText(new RegExp(form.emailLabel)),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: form.methods.telegram }),
    ).toBeChecked();

    await userEvent.click(screen.getByText(form.methods.email));

    expect(screen.getByLabelText(new RegExp(form.emailLabel))).toBeVisible();
    expect(
      screen.queryByLabelText(new RegExp(form.usernameLabel)),
    ).not.toBeInTheDocument();
  });

  it("keeps the selected method when it is clicked again", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByText(form.methods.email));

    expect(
      screen.getByRole("radio", { name: form.methods.email }),
    ).toBeChecked();
    expect(screen.getByLabelText(new RegExp(form.emailLabel))).toBeVisible();
  });

  it("keeps the typed email while Telegram is selected", async () => {
    render(<ContactForm form={form} />);

    await userEvent.type(getFields(form).email, "a@b.co");
    await userEvent.click(screen.getByText(form.methods.telegram));
    await userEvent.click(screen.getByText(form.methods.email));

    expect(getFields(form).email).toHaveValue("a@b.co");
  });

  it("asks for the Telegram value, not the email, when Telegram is selected", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByText(form.methods.telegram));
    await userEvent.click(screen.getByRole("button", { name: form.send }));

    expect(
      screen.getByLabelText(new RegExp(form.usernameLabel)),
    ).toHaveAccessibleDescription(form.errors.required);
  });

  it("shows localized errors for an empty submit and no notice", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByRole("button", { name: form.send }));

    const fields = getFields(form);

    expect(fields.name).toHaveAccessibleDescription(form.errors.required);
    expect(fields.email).toHaveAccessibleDescription(form.errors.required);
    expect(fields.message).toHaveAccessibleDescription(form.errors.required);
    expect(fields.name).toBeInvalid();
    expect(screen.queryByText(form.success.title)).not.toBeInTheDocument();
  });

  it("reports an invalid email", async () => {
    render(<ContactForm form={form} />);

    const fields = getFields(form);

    await userEvent.type(fields.name, "Alex");
    await userEvent.type(fields.email, "abc");
    await userEvent.type(fields.message, "Hello");
    await userEvent.click(screen.getByRole("button", { name: form.send }));

    expect(fields.email).toHaveAccessibleDescription(form.errors.invalidEmail);
  });

  it("clears the error of a field when it is edited", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByRole("button", { name: form.send }));
    await userEvent.type(getFields(form).name, "A");

    expect(getFields(form).name).not.toHaveAttribute("aria-invalid");
  });

  it("limits the fields with maxLength: 100 for name, email and Telegram, 1000 for the message", async () => {
    render(<ContactForm form={form} />);

    const fields = getFields(form);

    expect(fields.name).toHaveAttribute("maxlength", "100");
    expect(fields.email).toHaveAttribute("maxlength", "100");
    expect(fields.message).toHaveAttribute("maxlength", "1000");

    await userEvent.click(screen.getByText(form.methods.telegram));

    expect(
      screen.getByLabelText(new RegExp(form.usernameLabel)),
    ).toHaveAttribute("maxlength", "100");
  });

  it("stops typing at the limit and shows no message", async () => {
    render(<ContactForm form={form} />);

    await userEvent.type(getFields(form).name, "a".repeat(105));

    expect(getFields(form).name).toHaveValue("a".repeat(100));
    expect(screen.queryByText(/100/)).not.toBeInTheDocument();
  });

  it("keeps an invalid email error while the address is still invalid and clears it once it is valid", async () => {
    render(<ContactForm form={form} />);

    await userEvent.type(getFields(form).name, "Alex");
    await userEvent.type(getFields(form).email, "abc");
    await userEvent.type(getFields(form).message, "Hello");
    await userEvent.click(screen.getByRole("button", { name: form.send }));

    expect(getFields(form).email).toHaveAccessibleDescription(
      form.errors.invalidEmail,
    );

    await userEvent.type(getFields(form).email, "d");

    expect(getFields(form).email).toHaveAccessibleDescription(
      form.errors.invalidEmail,
    );

    await userEvent.type(getFields(form).email, "@b.co");

    expect(getFields(form).email).not.toHaveAttribute("aria-invalid");
  });

  it("does not show a stale contact error after switching the method back and forth", async () => {
    render(<ContactForm form={form} />);

    await userEvent.click(screen.getByRole("button", { name: form.send }));
    expect(getFields(form).email).toBeInvalid();

    await userEvent.click(screen.getByText(form.methods.telegram));
    await userEvent.click(screen.getByText(form.methods.email));

    expect(getFields(form).email).not.toHaveAttribute("aria-invalid");
  });

  it("clears the form, returns to Email and shows the notice after a valid submit without a request", async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm form={form} />);

    await userEvent.type(getFields(form).name, "Alex");
    await userEvent.type(getFields(form).email, "a@b.co");
    await userEvent.type(getFields(form).message, "Hello");
    await userEvent.click(screen.getByText(form.methods.telegram));
    await userEvent.type(
      screen.getByLabelText(new RegExp(form.usernameLabel)),
      "@alex",
    );
    await userEvent.click(screen.getByRole("button", { name: form.send }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("radio", { name: form.methods.email }),
    ).toBeChecked();

    const fields = getFields(form);

    expect(fields.name).toHaveValue("");
    expect(fields.email).toHaveValue("");
    expect(fields.message).toHaveValue("");

    const notice = screen.getByRole("status");

    expect(notice).toHaveTextContent(form.success.title);
    expect(notice).toHaveTextContent(form.success.text);
  });
});
