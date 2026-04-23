/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionsService } from "../services/auctionsService";
import {
  AuctionStatesSummaryCountry,
  AuctionStatesSummaryStatus,
  CalendarFilters,
  ReminderRequest,
} from "../types";

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

export const useCalendarAuctions = (filters: CalendarFilters) => {
  return useQuery({
    queryKey: ["calendar-auctions", filters],
    queryFn: () => auctionsService.getCalendarAuctions(filters),
  });
};

export const useAuctionsByDate = (date: string) => {
  return useQuery({
    queryKey: ["auctions-by-date", date],
    queryFn: () => auctionsService.getAuctionsByDate(date),
    enabled: !!date,
  });
};

export const useSetAuctionReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, reminderData }: { auctionId: string; reminderData: ReminderRequest }) =>
      auctionsService.setAuctionReminder(auctionId, reminderData),
    onSuccess: () => {
      // Invalidate calendar queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["calendar-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["auctions-by-date"] });
    },
  });
};

export const useAuctionStatesSummary = ({
  country,
  status,
}: {
  country: AuctionStatesSummaryCountry;
  status?: AuctionStatesSummaryStatus;
}) => {
  return useQuery({
    queryKey: ["auction-states-summary", country, status ?? "all"],
    queryFn: () => auctionsService.getAuctionStatesSummary({ country, status }),
    enabled: !!country,
  });
};
