"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { contactSchema } from "../model/contactSchema";
import type { ContactFormValues } from "../model/types";
import { useSuccessNotice } from "./useSuccessNotice";

const DEFAULT_VALUES: ContactFormValues = {
  email: "",
  message: "",
  method: "email",
  name: "",
  telegram: "",
};

export const useContactForm = () => {
  // The library defaults do the rest: values are written by the fields, an
  // invalid field is re-validated while it is edited, and the values of the
  // contact field that is not shown are kept.
  const methods = useForm<ContactFormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(contactSchema),
  });
  const notice = useSuccessNotice();

  const submit = methods.handleSubmit(() => {
    // TEMPORARY (TODO(contacts-delivery)): nothing is sent anywhere yet, the
    // form only pretends to. Replace with a real request when a delivery
    // channel exists.
    methods.reset(DEFAULT_VALUES);
    notice.show();
  });

  return { isSent: notice.isVisible, methods, submit };
};
