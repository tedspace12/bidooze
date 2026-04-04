import { useQuery } from "@tanstack/react-query";
import { auctionsByLocationService } from "../services/auctionsByLocationService";
import { type AuctionsByLocationParams } from "../types";

export const useAuctionsByLocation = (params: AuctionsByLocationParams) =>
  useQuery({
    queryKey: ["auctions-by-location", params.state, params.page],
    queryFn: () => auctionsByLocationService.getAuctionsByLocation(params),
    enabled: !!(params.state || params.country || params.zip_code),
  });

export const useStateFeatured = (stateCode: string | null) =>
  useQuery({
    queryKey: ["state-featured", stateCode],
    queryFn: () => auctionsByLocationService.getStateFeatured(stateCode!),
    enabled: !!stateCode,
  });