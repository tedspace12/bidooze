import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import LotCard from "./LotCard";

// Category tree with subcategories
const categoryTree = [
  {
    id: "art",
    label: "Art",
    subcategories: [
      { id: "paintings", label: "Paintings" },
      { id: "sculptures", label: "Sculptures" },
      { id: "photography", label: "Photography" },
      { id: "prints", label: "Prints & Multiples" },
    ],
  },
  {
    id: "antiques",
    label: "Antiques",
    subcategories: [
      { id: "furniture", label: "Furniture" },
      { id: "ceramics", label: "Ceramics & Porcelain" },
      { id: "silver", label: "Silver & Metalware" },
      { id: "clocks", label: "Clocks & Watches" },
    ],
  },
  {
    id: "jewelry",
    label: "Jewelry & Watches",
    subcategories: [
      { id: "fine-jewelry", label: "Fine Jewelry" },
      { id: "vintage-jewelry", label: "Vintage Jewelry" },
      { id: "luxury-watches", label: "Luxury Watches" },
      { id: "costume-jewelry", label: "Costume Jewelry" },
    ],
  },
  {
    id: "collectibles",
    label: "Collectibles",
    subcategories: [
      { id: "coins", label: "Coins & Currency" },
      { id: "stamps", label: "Stamps" },
      { id: "memorabilia", label: "Memorabilia" },
      { id: "toys", label: "Toys & Games" },
    ],
  },
  {
    id: "fashion",
    label: "Fashion & Accessories",
    subcategories: [
      { id: "handbags", label: "Handbags" },
      { id: "clothing", label: "Designer Clothing" },
      { id: "shoes", label: "Shoes" },
      { id: "accessories", label: "Accessories" },
    ],
  },
];

interface Lot {
  id: string;
  lotNumber: number;
  title: string;
  image: string;
  currentBid: number;
  estimateLow: number;
  estimateHigh: number;
  bids: number;
  status: "open" | "closed";
  realizedPrice?: number;
  featured?: boolean;
  shippingAvailable: boolean;
  nextBid?: number;
}

interface LotsGridProps {
  lots: Lot[];
  isRegistered?: boolean;
  bidding?: {
    mode: string;
    allow_proxy: boolean;
    require_proxy: boolean;
    default_amount_type: string;
  };
  buyerPremiumPercentage?: number | null;
}

const sortOptions = [
  { value: "lot-number", label: "Lot Number" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "ending-soon", label: "Ending Soonest" },
  { value: "newest", label: "Newest" },
  { value: "most-bids", label: "Most Bids" },
  { value: "least-bids", label: "Least Bids" },
];

const itemsPerPageOptions = [12, 24, 48, 96];

const LotsGrid = ({ lots, isRegistered = false, bidding, buyerPremiumPercentage }: LotsGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lot-number");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleExpandCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategorySelected = (categoryId: string) =>
    selectedCategories.includes(categoryId);

  const isParentSelected = (parentId: string) => {
    const parent = categoryTree.find((c) => c.id === parentId);
    if (!parent) return false;
    return parent.subcategories.every((sub) =>
      selectedCategories.includes(sub.id)
    );
  };

  const getLotEffectivePrice = (lot: Lot) =>
    lot.status === "closed"
      ? lot.realizedPrice || 0
      : lot.nextBid ?? lot.currentBid;

  const toggleParentCategory = (parentId: string) => {
    const parent = categoryTree.find((c) => c.id === parentId);
    if (!parent) return;
    const allSubIds = parent.subcategories.map((sub) => sub.id);
    if (isParentSelected(parentId)) {
      setSelectedCategories((prev) =>
        prev.filter((c) => !allSubIds.includes(c))
      );
    } else {
      setSelectedCategories((prev) => [
        ...prev.filter((c) => !allSubIds.includes(c)),
        ...allSubIds,
      ]);
    }
  };

  // Filter and sort lots
  const filteredLots = useMemo(() => {
    let result = [...lots];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lot) =>
          lot.title.toLowerCase().includes(query) ||
          lot.lotNumber.toString().includes(query)
      );
    }

    // Price filter
    if (priceFrom) {
      result = result.filter((lot) => {
        const price = getLotEffectivePrice(lot);
        return price >= parseInt(priceFrom);
      });
    }
    if (priceTo) {
      result = result.filter((lot) => {
        const price = getLotEffectivePrice(lot);
        return price <= parseInt(priceTo);
      });
    }

    // Sort
    switch (sortBy) {
      case "lot-number":
        result.sort((a, b) => a.lotNumber - b.lotNumber);
        break;
      case "price-low":
        result.sort((a, b) => getLotEffectivePrice(a) - getLotEffectivePrice(b));
        break;
      case "price-high":
        result.sort((a, b) => getLotEffectivePrice(b) - getLotEffectivePrice(a));
        break;
      case "most-bids":
        result.sort((a, b) => b.bids - a.bids);
        break;
      case "least-bids":
        result.sort((a, b) => a.bids - b.bids);
        break;
    }

    return result;
  }, [lots, searchQuery, sortBy, priceFrom, priceTo]);

  // Pagination
  const totalPages = Math.ceil(filteredLots.length / itemsPerPage);
  const paginatedLots = filteredLots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          All Lots ({filteredLots.length})
        </h2>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by lot name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm md:text-base"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Items per page */}
          <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Filters Toggle */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Extended Filters */}
        <Collapsible open={showFilters}>
          <CollapsibleContent>
            <div className="pt-4 mt-4 border-t border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Price Range
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                {/* <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Categories
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-1 border border-border rounded-lg p-3 bg-background">
                    {categoryTree.map((category) => (
                      <Collapsible
                        key={category.id}
                        open={expandedCategories.includes(category.id)}
                      >
                        <div className="flex items-center gap-2">
                          <CollapsibleTrigger
                            onClick={() => toggleExpandCategory(category.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </CollapsibleTrigger>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`cat-${category.id}`}
                              checked={isParentSelected(category.id)}
                              onCheckedChange={() => toggleParentCategory(category.id)}
                            />
                            <label
                              htmlFor={`cat-${category.id}`}
                              className="text-sm font-medium text-foreground cursor-pointer"
                            >
                              {category.label}
                            </label>
                          </div>
                        </div>
                        <CollapsibleContent>
                          <div className="ml-8 mt-1 space-y-1">
                            {category.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`cat-${sub.id}`}
                                  checked={isCategorySelected(sub.id)}
                                  onCheckedChange={() => toggleCategory(sub.id)}
                                />
                                <label
                                  htmlFor={`cat-${sub.id}`}
                                  className="text-sm text-foreground cursor-pointer"
                                >
                                  {sub.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-sm text-muted-foreground">View:</span>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className="h-9 w-9"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
          className="h-9 w-9"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Lots Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            : "flex flex-col gap-4 mb-8"
        }
      >
        {paginatedLots.map((lot) => (
          <LotCard key={lot.id} lot={lot} viewMode={viewMode} isRegistered={isRegistered} bidding={bidding} buyerPremiumPercentage={buyerPremiumPercentage} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default LotsGrid;