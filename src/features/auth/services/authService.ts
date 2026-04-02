import { withoutAuth, withAuth } from "@/services/api";

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

  async getCurrentUser() {
    try {
      const res = await withAuth.get("/user");
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBuyerProfile() {
    try {
      const res = await withAuth.get("/buyer/profile");
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async updateBuyerProfile(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    country?: string;
    phone_number?: string;
    bio?: string;
    timezone?: string;
    company_name?: string;
    company_url?: string;
  }) {
    try {
      const res = await withAuth.put("/buyer/profile", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async updateBuyerPassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    try {
      const res = await withAuth.put("/buyer/password", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getPaymentMethods() {
    try {
      const res = await withAuth.get("/buyer/payment-methods");
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async addPaymentMethod(data: {
    card_holder_name: string;
    card_number: string;
    expiration_date: string;
    cvv: string;
    is_default: boolean;
    provider: string;
  }) {
    try {
      const res = await withAuth.post("/buyer/payment-methods", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async setDefaultPaymentMethod(paymentMethodId: number, data: { is_default: boolean }) {
    try {
      const res = await withAuth.patch(`/buyer/payment-methods/${paymentMethodId}`, data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

    async verifyPaymentMethod(paymentMethodId: number) {
    try {      const res = await withAuth.post(`/buyer/payment-methods/${paymentMethodId}/verify`, {});
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async deletePaymentMethod(paymentMethodId: number) {
    try {
      const res = await withAuth.delete(`/buyer/payment-methods/${paymentMethodId}`);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async getBillingAddresses() {
    try {
      const res = await withAuth.get("/buyer/billing-addresses");
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async addBillingAddress(data: {
    name: string;
    country: string;
    address: string;
    city: string;
    state?: string;
    zip_code: string;
    phone_number: string;
    is_default: boolean;
  }) {
    try {
      const res = await withAuth.post("/buyer/billing-addresses", data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async updateBillingAddress(billingAddressId: number, data: {
    name?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
    is_default?: boolean;
  }) {
    try {
      const res = await withAuth.patch(`/buyer/billing-addresses/${billingAddressId}`, data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async deleteBillingAddress(billingAddressId: number) {
    try {
      const res = await withAuth.delete(`/buyer/billing-addresses/${billingAddressId}`);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },

  async logout() {
    try {
      const res = await withAuth.post("/logout", {});
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw error?.response?.data || { message: error.message };
    }
  },
};
