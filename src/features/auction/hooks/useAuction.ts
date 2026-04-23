import { useQuery, useMutation } from "@tanstack/react-query";
import { auctionService } from "../services/auctionService";
import { AuctionRegistrationPayload } from "../types";

export const useAuction = (identifier?: string) => {
  const useAuctionDetails = () =>
    useQuery({
      queryKey: ["auction-details", identifier],
      queryFn: () => auctionService.getAuctionDetails(identifier as string),
      enabled: !!identifier,
    });

  const useAuctionLots = () =>
    useQuery({
      queryKey: ["auction-lots", identifier],
      queryFn: () => auctionService.getAuctionLots(identifier as string),
      enabled: !!identifier,
    });

  const useRegisterForAuction = () =>
    useMutation({
      mutationFn: (data: AuctionRegistrationPayload) =>
        auctionService.registerForAuction(identifier as string, data),
    });

  const useAddToWatchlist = () =>
    useMutation({
      mutationFn: (lotId: string | number) =>
        auctionService.addToWatchlist(lotId),
    });

  const useRemoveFromWatchlist = () =>
    useMutation({
      mutationFn: (lotId: string | number) =>
        auctionService.removeFromWatchlist(lotId),
    });

  return {
    useAuctionDetails,
    useAuctionLots,
    useRegisterForAuction,
    useAddToWatchlist,
    useRemoveFromWatchlist,
  };
};

