import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, MapPin, ChevronDown, ChevronUp, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AuctionStatus } from "../types";

type FilterSection = "status" | "shipping" | "date" | "categories" | "lotType";

interface Filters {
  search: string;
  zipCode: string;
  distance: string;
  status: AuctionStatus[];
  shipping: string[];
  dateRange: { from: Date; to: Date } | null;
  categories: string[];
  lotType: string[];
  state: string;
}

interface AuctionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  type: 'auction' | 'lot'
}

const statusOptions: { value: AuctionStatus; label: string }[] = [
  { value: "all", label: "All Auctions" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closing-soon", label: "Closing Soon" },
  { value: "featured", label: "Featured" },
  { value: "top-picks", label: "Top Picks" },
  { value: "hot", label: "Hot" },
  { value: "closed", label: "Closed" },
];

const categoryTree = [
  {
    name: "Antiques & Collectibles",
    subcategories: ["Furniture", "Pottery", "Glass", "Toys", "Memorabilia"],
  },
  {
    name: "Art",
    subcategories: ["Paintings", "Sculptures", "Photography", "Prints", "Digital Art"],
  },
  {
    name: "Cars & Vehicles",
    subcategories: ["Classic Cars", "Motorcycles", "Trucks", "Boats", "Parts"],
  },
  {
    name: "Jewelry & Watches",
    subcategories: ["Rings", "Necklaces", "Watches", "Bracelets", "Earrings"],
  },
  {
    name: "Real Estate",
    subcategories: ["Residential", "Commercial", "Land", "Vacation Homes"],
  },
  {
    name: "Fashion",
    subcategories: ["Designer Clothing", "Handbags", "Shoes", "Accessories"],
  },
];

const lotTypeOptions = [
  { value: "all", label: "All lots" },
  { value: "biddable", label: "Biddable lots" },
  { value: "live-webcast", label: "Live webcast lots" },
  { value: "online-only", label: "Online-only lots" },
  { value: "absentee", label: "Absentee lots" },
  { value: "listing-only", label: "Listing-only lots" },
];

const AuctionFilters = ({ filters, onFiltersChange, type }: AuctionFiltersProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<FilterSection[]>(["status"]);

  const toggleSection = (section: FilterSection) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleStatus = (status: AuctionStatus) => {
    if (status === "all") {
      updateFilter("status", ["all"]);
      return;
    }

    let newStatus = filters.status.filter(s => s !== "all");
    if (newStatus.includes(status)) {
      newStatus = newStatus.filter(s => s !== status);
    } else {
      newStatus = [...newStatus, status];
    }

    if (newStatus.length === 0) {
      newStatus = ["live"];
    }

    updateFilter("status", newStatus as AuctionStatus[]);
  };

  const toggleShipping = (value: string) => {
    const newShipping = filters.shipping.includes(value)
      ? filters.shipping.filter(s => s !== value)
      : [...filters.shipping, value];
    updateFilter("shipping", newShipping);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const toggleLotType = (type: string) => {
    if (type === "all") {
      updateFilter("lotType", ["all"]);
      return;
    }

    let newTypes = filters.lotType.filter(t => t !== "all");
    if (newTypes.includes(type)) {
      newTypes = newTypes.filter(t => t !== type);
    } else {
      newTypes = [...newTypes, type];
    }

    if (newTypes.length === 0) {
      newTypes = ["all"];
    }

    updateFilter("lotType", newTypes);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      zipCode: "",
      distance: "50",
      status: ["live"] as AuctionStatus[],
      shipping: [],
      dateRange: null,
      categories: [],
      lotType: [],
      state: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.zipCode ||
    filters.distance !== "50" ||
    (filters.status.length > 0 && !filters.status.includes("live")) ||
    filters.shipping.length > 0 ||
    filters.dateRange ||
    filters.categories.length > 0 ||
    filters.lotType.length > 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 sticky top-28">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={type === 'auction' ? "Search auctions..." : "Search lots..."}
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Location</Label>

          <div className="space-y-3">
            <Select value={filters.state} onValueChange={(v) => updateFilter("state", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="alaska">Alaska</SelectItem>
                <SelectItem value="alabama">Alabama</SelectItem>
                <SelectItem value="arizona">Arizona</SelectItem>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="colorado">Colorado</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zip code"
                value={filters.zipCode}
                onChange={(e) => updateFilter("zipCode", e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filters.distance} onValueChange={(v) => updateFilter("distance", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="anywhere">Anywhere</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
                <SelectItem value="50">Within 50 miles</SelectItem>
                <SelectItem value="100">Within 100 miles</SelectItem>
                <SelectItem value="200">Within 200 miles</SelectItem>
                <SelectItem value="250">Within 250 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auction Status */}
        <Collapsible open={openSections.includes("status")} onOpenChange={() => toggleSection("status")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Auction Status</Label>
            {openSections.includes("status") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.status.includes(option.value)}
                    onCheckedChange={() => toggleStatus(option.value)}
                  />
                  <Label htmlFor={`status-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Shipping */}
        <Collapsible open={openSections.includes("shipping")} onOpenChange={() => toggleSection("shipping")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Shipping</Label>
            {openSections.includes("shipping") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="shipping-available"
                  checked={filters.shipping.includes("shipping")}
                  onCheckedChange={() => toggleShipping("shipping")}
                />
                <Label htmlFor="shipping-available" className="text-sm cursor-pointer">
                  Shipping available
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="pickup-only"
                  checked={filters.shipping.includes("pickup")}
                  onCheckedChange={() => toggleShipping("pickup")}
                />
                <Label htmlFor="pickup-only" className="text-sm cursor-pointer">
                  Local pickup only
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Date Range */}
        <Collapsible open={openSections.includes("date")} onOpenChange={() => toggleSection("date")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Auction Date</Label>
            {openSections.includes("date") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd")} -{" "}
                        {format(filters.dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={filters.dateRange ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      updateFilter("dateRange", { from: range.from, to: range.to });
                    } else {
                      updateFilter("dateRange", null);
                    }
                  }}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {filters.dateRange && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-auto p-0 text-xs text-muted-foreground"
                onClick={() => updateFilter("dateRange", null)}
              >
                <X className="h-3 w-3 mr-1" /> Clear date
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Categories */}
        <Collapsible open={openSections.includes("categories")} onOpenChange={() => toggleSection("categories")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Categories</Label>
            {openSections.includes("categories") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <div className="space-y-1">
              {categoryTree.map((category) => (
                <Collapsible
                  key={category.name}
                  open={expandedCategories.includes(category.name)}
                  onOpenChange={(open) => {
                    setExpandedCategories(open
                      ? [...expandedCategories, category.name]
                      : expandedCategories.filter(c => c !== category.name)
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category.name}`}
                      checked={filters.categories.includes(category.name)}
                      onCheckedChange={() => toggleCategory(category.name)}
                    />
                    <CollapsibleTrigger className="flex items-center gap-1 flex-1 py-1.5">
                      <Label htmlFor={`cat-${category.name}`} className="text-sm cursor-pointer flex-1 text-left">
                        {category.name}
                      </Label>
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform",
                        expandedCategories.includes(category.name) && "rotate-180"
                      )} />
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pl-6 space-y-1 mt-1">
                    {category.subcategories.map((sub) => (
                      <div key={sub} className="flex items-center gap-2">
                        <Checkbox
                          id={`subcat-${sub}`}
                          checked={filters.categories.includes(sub)}
                          onCheckedChange={() => toggleCategory(sub)}
                        />
                        <Label htmlFor={`subcat-${sub}`} className="text-sm cursor-pointer text-muted-foreground">
                          {sub}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Lot Type */}
        <Collapsible open={openSections.includes("lotType")} onOpenChange={() => toggleSection("lotType")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Lot Type</Label>
            {openSections.includes("lotType") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <div className="space-y-2">
              {lotTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`lot-${option.value}`}
                    checked={filters.lotType.includes(option.value)}
                    onCheckedChange={() => toggleLotType(option.value)}
                  />
                  <Label htmlFor={`lot-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AuctionFilters;
