import { useMutation, useQuery } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import type { BuyerSettingsUpdatePayload } from "../types";

export const useSettings = () => {
  const useBuyerSettings = () =>
    useQuery({
      queryKey: ["buyer-settings"],
      queryFn: () => settingsService.getBuyerSettings(),
    });

  const updateBuyerSettings = useMutation({
    mutationFn: (data: BuyerSettingsUpdatePayload) =>
      settingsService.updateBuyerSettings(data),
    mutationKey: ["update-buyer-settings"],
  });

  return {
    useBuyerSettings,
    updateBuyerSettings,
  };
};
