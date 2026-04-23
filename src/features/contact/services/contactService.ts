/* eslint-disable @typescript-eslint/no-explicit-any */
import { withoutAuth } from "@/services/api";
import type { ContactPayload, ContactResponse } from "../types";

export const contactService = {
  async submitContact(data: ContactPayload): Promise<ContactResponse> {
    try {
      const res = await withoutAuth.post<ContactResponse>("/contact", data);
      return res.data;
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
