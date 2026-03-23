import { withoutAuth } from "@/services/api";

export const authService = {
  async registerEmail(data: { email: string }) {
    try {
      const res = await withoutAuth.post("/buyer/register/email", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async verifyOTP(data: { email: string; otp: string }) {
    try {
      const res = await withoutAuth.post("/buyer/register/verify-otp", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async resendOTP(data: { email: string }) {
    try {
      const res = await withoutAuth.post("/buyer/register/resend-otp", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async createPassword(data: { email: string; password: string }) {
    try {
      const res = await withoutAuth.post("/buyer/register/password", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async setPersonalInfo(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country_code: string;
  }) {
    try {
      const res = await withoutAuth.post("/buyer/register/personal-info", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async completeProfile(data: {
    email: string;
    shopping_preference: string[];
    full_address: string;
    card_holder_name: string;
    card_number: string;
    expiry_date: string;
    cvv: string;
  }) {
    try {
      const res = await withoutAuth.post("/buyer/register/profile", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async login(data: { email: string; password: string }) {
    try {
      const res = await withoutAuth.post("/buyer/login", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
