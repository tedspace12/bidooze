import { useCalendarAuctions, useAuctionsByDate, useSetAuctionReminder } from "../hooks";
import { useAuctioneer } from "../../auctioneers/hooks/useAuctioneer";
import { CalendarFilters, ReminderRequest } from "../types";

// Re-export hooks for easy access
export { useCalendarAuctions, useAuctionsByDate, useSetAuctionReminder };

// Re-export types
export type { CalendarFilters, ReminderRequest };

// Hook to get real auctioneers data
export const useAuctioneersData = () => {
  const { useAuctioneers } = useAuctioneer();
  const { data: auctioneersData, isLoading, error } = useAuctioneers({});

  const auctioneers = auctioneersData?.data.map(auctioneer => ({
    id: auctioneer.id.toString(),
    name: auctioneer.company_name,
  })) || [];

  return { auctioneers, isLoading, error };
};

export const auctionTypes = [
  { id: "scheduled", name: "Scheduled" },
  { id: "live", name: "Live" },
  { id: "paused", name: "Paused" },
  { id: "closed", name: "Closed" },
];
