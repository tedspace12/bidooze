import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useAuth = () => {
  const registerEmail = useMutation({
    mutationFn: authService.registerEmail,
    mutationKey: ["register-email"],
  });

  const verifyOTP = useMutation({
    mutationFn: authService.verifyOTP,
    mutationKey: ["register-verify-otp"],
  });

  const resendOTP = useMutation({
    mutationFn: authService.resendOTP,
    mutationKey: ["register-resend-otp"],
  });

  const createPassword = useMutation({
    mutationFn: authService.createPassword,
    mutationKey: ["register-create-password"],
  });

  const setPersonalInfo = useMutation({
    mutationFn: authService.setPersonalInfo,
    mutationKey: ["register-set-profile"],
  });

  const completeProfile = useMutation({
    mutationFn: authService.completeProfile,
    mutationKey: ["register-complete-profile"],
  });

  const socialAuth = useMutation({
    mutationFn: authService.socialAuth,
    mutationKey: ["social-auth"],
  });

  const login = useMutation({
    mutationFn: authService.login,
    mutationKey: ["login"],
  });

  const getBuyerProfile = useMutation({
    mutationFn: authService.getBuyerProfile,
    mutationKey: ["get-buyer-profile"],
  });

  const updateBuyerProfile = useMutation({
    mutationFn: authService.updateBuyerProfile,
    mutationKey: ["update-buyer-profile"],
  });

  const updateBuyerPassword = useMutation({
    mutationFn: authService.updateBuyerPassword,
    mutationKey: ["update-buyer-password"],
  });

  const getPaymentMethods = useMutation({
    mutationFn: authService.getPaymentMethods,
    mutationKey: ["get-payment-methods"],
  });

  const addPaymentMethod = useMutation({
    mutationFn: authService.addPaymentMethod,
    mutationKey: ["add-payment-method"],
  });

  const setDefaultPaymentMethod = useMutation({
    mutationFn: ({ paymentMethodId, data }: { paymentMethodId: number; data: { is_default: boolean } }) =>
      authService.setDefaultPaymentMethod(paymentMethodId, data),
    mutationKey: ["set-default-payment-method"],
  });

  const verifyPaymentMethod = useMutation({
    mutationFn: ({ paymentMethodId}: { paymentMethodId: number; }) =>
      authService.verifyPaymentMethod(paymentMethodId),
    mutationKey: ["verify-payment-method"],
  });

  const deletePaymentMethod = useMutation({
    mutationFn: authService.deletePaymentMethod,
    mutationKey: ["delete-payment-method"],
  });

  const getBillingAddresses = useMutation({
    mutationFn: authService.getBillingAddresses,
    mutationKey: ["get-billing-addresses"],
  });

  const addBillingAddress = useMutation({
    mutationFn: authService.addBillingAddress,
    mutationKey: ["add-billing-address"],
  });

  const updateBillingAddress = useMutation({
    mutationFn: ({ billingAddressId, data }: { billingAddressId: number; data: any }) =>
      authService.updateBillingAddress(billingAddressId, data),
    mutationKey: ["update-billing-address"],
  });

  const deleteBillingAddress = useMutation({
    mutationFn: authService.deleteBillingAddress,
    mutationKey: ["delete-billing-address"],
  });

  return {
    registerEmail,
    verifyOTP,
    resendOTP,
    createPassword,
    setPersonalInfo,
    completeProfile,
    socialAuth,
    login,
    getBuyerProfile,
    updateBuyerProfile,
    updateBuyerPassword,
    getPaymentMethods,
    addPaymentMethod,
    setDefaultPaymentMethod,
    verifyPaymentMethod,
    deletePaymentMethod,
    getBillingAddresses,
    addBillingAddress,
    updateBillingAddress,
    deleteBillingAddress,
  };
};
