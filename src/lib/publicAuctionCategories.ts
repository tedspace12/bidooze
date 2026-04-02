import type { Category } from "@/features/home/types";

export const fallbackAuctionCategories: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: "Antiques & Collectibles",
    slug: "antiques-collectibles",
    image_url: "/images/category-antiques.jpg",
    sort_order: 1,
    published_auctions_count: 1240,
    subcategories: [],
  },
  {
    id: 2,
    parent_id: null,
    name: "Art",
    slug: "art",
    image_url: "/images/category-art.jpg",
    sort_order: 2,
    published_auctions_count: 856,
    subcategories: [],
  },
  {
    id: 3,
    parent_id: null,
    name: "Cars & Vehicles",
    slug: "cars-vehicles",
    image_url: "/images/category-cars.jpg",
    sort_order: 3,
    published_auctions_count: 423,
    subcategories: [],
  },
  {
    id: 4,
    parent_id: null,
    name: "Jewelry & Watches",
    slug: "jewelry-watches",
    image_url: "/images/category-jewelry.jpg",
    sort_order: 4,
    published_auctions_count: 1567,
    subcategories: [],
  },
  {
    id: 5,
    parent_id: null,
    name: "Real Estate",
    slug: "real-estate",
    image_url: "/images/category-realestate.jpg",
    sort_order: 5,
    published_auctions_count: 234,
    subcategories: [],
  },
  {
    id: 6,
    parent_id: null,
    name: "Fashion",
    slug: "fashion",
    image_url: "/images/category-fashion.jpg",
    sort_order: 6,
    published_auctions_count: 789,
    subcategories: [],
  },
];

export const buildAuctionCategoryHref = (slug: string) =>
  `/auctions?category=${encodeURIComponent(slug)}`;
