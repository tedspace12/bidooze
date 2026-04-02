import { useQuery } from "@tanstack/react-query";
import { homeService } from "../services/homeService";

export const useHome = () => {
  const useFeaturedHero = () =>
    useQuery({
      queryKey: ["home-featured-hero"],
      queryFn: () => homeService.getFeaturedHero(),
    });

  const useFeaturedAuctions = () =>
    useQuery({
      queryKey: ["home-featured-auctions"],
      queryFn: () => homeService.getFeaturedAuctions(),
    });

  const useRecommendations = () =>
    useQuery({
      queryKey: ["home-recommendations"],
      queryFn: () => homeService.getRecommendations(),
    });

  const useHotAuctions = () =>
    useQuery({
      queryKey: ["home-hot-auctions"],
      queryFn: () => homeService.getHotAuctions(),
    });

  const useCategories = () =>
    useQuery({
      queryKey: ["home-categories"],
      queryFn: () => homeService.getCategories(),
    });

  return {
    useFeaturedHero,
    useFeaturedAuctions,
    useRecommendations,
    useHotAuctions,
    useCategories,
  };
};

