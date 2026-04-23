import { useQuery, useMutation } from "@tanstack/react-query";
import { auctioneerService, type AuctioneerParams } from "../services/auctioneerService";

export const useAuctioneer = (identifier?: string) => {
    const useAuctioneerDetails = (params?: {status?: string; per_page?: number; page?: number }) =>
        useQuery({
            queryKey: ["auctioneer-details", identifier, params],
            queryFn: () => auctioneerService.getAuctioneerDetails(identifier as string, params),
            enabled: !!identifier,
        });

    const useAuctioneers = (params: AuctioneerParams) =>
        useQuery({
            queryKey: ["auctioneers", params],
            queryFn: () => auctioneerService.getAuctioneers(params),
        });

    const useAddToFavorites = () =>
        useMutation({
            mutationFn: (auctioneerId: string | number) =>
                auctioneerService.addToFavorites(auctioneerId),
        });

    const useRemoveFromFavorites = () =>
        useMutation({
            mutationFn: (auctioneerId: string | number) =>
                auctioneerService.removeFromFavorites(auctioneerId),
        });

    return {
        useAuctioneerDetails,
        useAuctioneers,
        useAddToFavorites,
        useRemoveFromFavorites,
    };
}