import { useQuery } from "@tanstack/react-query";
import type { LotsListParams } from "../services/lotService";
import { lotService } from "../services/lotService";

export const useLot = (auctionId?: string, lotId?: string) => {
  const useLotDetails = () =>
    useQuery({
      queryKey: ["lot-details", auctionId, lotId],
      queryFn: () => lotService.getLotDetails(auctionId as string, lotId as string),
      enabled: !!auctionId && !!lotId,
    });

  return { useLotDetails };
};

export const useLots = (params: LotsListParams = {}) => {
  return useQuery({
    queryKey: ["lots", params],
    queryFn: () => lotService.getLots(params),
  });
};


