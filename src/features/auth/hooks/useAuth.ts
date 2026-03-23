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

  const login = useMutation({
    mutationFn: authService.login,
    mutationKey: ["login"],
  });

  return {
    registerEmail,
    verifyOTP,
    resendOTP,
    createPassword,
    setPersonalInfo,
    completeProfile,
    login,
  };
};
