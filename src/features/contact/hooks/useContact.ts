import { useMutation } from "@tanstack/react-query";
import { contactService } from "../services/contactService";
import type { ContactPayload } from "../types";

export const useContact = () => {
  const useSubmitContact = () =>
    useMutation({
      mutationFn: (data: ContactPayload) => contactService.submitContact(data),
    });

  return { useSubmitContact };
};
