/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { auctionsService } from "../services/auctionsService";

export const useAuctions = () => {
  const useAllAuctions = (params: Record<string, any>) => {
    return useQuery({
      queryKey: ["get-all-auctions", params],
      queryFn: () => auctionsService.getAuctions({ params }),
    });
  };

  return {
    useAllAuctions,
  };
};
