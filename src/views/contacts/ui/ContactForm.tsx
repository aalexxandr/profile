"use client";

import { useId } from "react";
import { FormProvider, useWatch } from "react-hook-form";

import type { Dictionary } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import { useContactForm } from "../lib/useContactForm";
import { ContactTextField } from "./ContactTextField";
import { FormToast } from "./FormToast";
import { MethodSelector } from "./MethodSelector";

type ContactFormProps = {
  form: Dictionary["pages"]["contacts"]["form"];
};

export const ContactForm = ({ form }: ContactFormProps) => {
  const titleId = useId();
  const { isSent, methods, submit } = useContactForm();
  const method = useWatch({ control: methods.control, name: "method" });

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <h2
        className="font-vcr text-[20px]/6 text-white uppercase md:text-[24px]/7"
        id={titleId}
      >
        {form.title}
      </h2>
      <FormProvider {...methods}>
        <form
          aria-labelledby={titleId}
          className="flex flex-col gap-6"
          noValidate
          onSubmit={submit}
        >
          <ContactTextField
            autoComplete="name"
            errorTexts={form.errors}
            label={form.nameLabel}
            name="name"
            required
          />
          <MethodSelector
            legend={form.methodLabel}
            options={[
              { label: form.methods.email, value: "email" },
              { label: form.methods.telegram, value: "telegram" },
            ]}
          />
          {method === "email" ? (
            <ContactTextField
              autoComplete="email"
              errorTexts={form.errors}
              inputMode="email"
              key="email"
              label={form.emailLabel}
              name="email"
              required
              type="email"
            />
          ) : (
            <ContactTextField
              errorTexts={form.errors}
              key="telegram"
              label={form.usernameLabel}
              name="telegram"
              required
            />
          )}
          <ContactTextField
            errorTexts={form.errors}
            label={form.messageLabel}
            multiline
            name="message"
            required
          />
          <Button className="md:w-48" type="submit">
            {form.send}
          </Button>
        </form>
      </FormProvider>
      <FormToast
        isVisible={isSent}
        text={form.success.text}
        title={form.success.title}
      />
    </div>
  );
};
