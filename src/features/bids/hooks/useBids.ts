import { useQuery } from "@tanstack/react-query";
import { bidsService } from "../services/bidsService";

export const useBids = () => {
  const useBidsSummary = () =>
    useQuery({
      queryKey: ["bids-summary"],
      queryFn: () => bidsService.getBidsSummary(),
    });

  const useBidsGrouped = () =>
    useQuery({
      queryKey: ["bids-grouped"],
      queryFn: () => bidsService.getBidsGrouped(),
    });

  const useBidsTopPicks = (limit?: number) =>
    useQuery({
      queryKey: ["bids-top-picks", limit],
      queryFn: () => bidsService.getBidsTopPicks(limit),
    });

  const useBidsRegisteredAuctions = () =>
    useQuery({
      queryKey: ["bids-registered-auctions"],
      queryFn: () => bidsService.getBidsRegisteredAuctions(),
    });

  const useWatchlist = (perPage?: number) =>
    useQuery({
      queryKey: ["watchlist", perPage],
      queryFn: () => bidsService.getWatchlist(perPage),
    });

  return {
    useBidsSummary,
    useBidsGrouped,
    useBidsTopPicks,
    useBidsRegisteredAuctions,
    useWatchlist,
  };
};