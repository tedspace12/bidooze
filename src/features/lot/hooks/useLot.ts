import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LotsListParams } from "../services/lotService";
import { lotService } from "../services/lotService";
import { auctionService } from "@/features/auction/services/auctionService";
import type { BidPayload } from "@/features/auction/types";

export const useLot = (auctionId?: string, lotId?: string) => {
  const queryClient = useQueryClient();

  const useLotDetails = () =>
    useQuery({
      queryKey: ["lot-details", auctionId, lotId],
      queryFn: () => lotService.getLotDetails(auctionId as string, lotId as string),
      enabled: !!auctionId && !!lotId,
    });

  const usePlaceBid = () =>
    useMutation({
      mutationFn: (data: BidPayload) =>
        auctionService.placeBid(auctionId as string, lotId as string, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auction-details", auctionId] });
        queryClient.invalidateQueries({ queryKey: ["lot-details", auctionId, lotId] });
        queryClient.invalidateQueries({ queryKey: ["auction-lots", auctionId] });
      },
    });

  return { useLotDetails, usePlaceBid };
};

export const useLots = (params: LotsListParams = {}) => {
  return useQuery({
    queryKey: ["lots", params],
    queryFn: () => lotService.getLots(params),
  });
};


