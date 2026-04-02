import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, MapPin, ChevronDown, ChevronUp, CalendarIcon, X } from "lucide-react";
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
import { countries, getSubdivisionsByCountry } from "@/lib/locationData";
import { fallbackAuctionCategories } from "@/lib/publicAuctionCategories";
import {
  auctionPresetOptions,
  auctionStatusOptions,
  categoryModeOptions,
  lotTypeOptions,
  shippingOptions,
} from "@/lib/publicAuctionFilters";
import {
  countActiveListingFilters,
  getDefaultListingFilters,
  type ListingFiltersState,
} from "@/lib/listingQueryParams";
import { cn } from "@/lib/utils";
import { useHome } from "@/features/home/hooks/useHome";
import type { Category } from "@/features/home/types";

type FilterSection =
  | "location"
  | "status"
  | "shipping"
  | "date"
  | "categories"
  | "lotType"
  | "advanced";

export type Filters = ListingFiltersState;

interface AuctionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  type: "auction" | "lot";
}

const AuctionFilters = ({
  filters,
  onFiltersChange,
  type,
}: AuctionFiltersProps) => {
  const [openSections, setOpenSections] = useState<FilterSection[]>([
    "status",
    "categories",
  ]);
  const { useCategories } = useHome();
  const categoriesQuery = useCategories();
  const categories =
    categoriesQuery.data?.data?.length ? categoriesQuery.data.data : fallbackAuctionCategories;

  // Flatten categories to include subcategories
  const allCategories = useMemo(() => {
    const flattened: Category[] = [];
    categories.forEach((category) => {
      flattened.push(category);
      if (category.subcategories) {
        flattened.push(...category.subcategories);
      }
    });
    return flattened.sort((a, b) => a.sort_order - b.sort_order);
  }, [categories]);

  const subdivisionOptions = useMemo(() => {
    if (filters.country === "all") return [];

    return getSubdivisionsByCountry(filters.country).map((subdivision) => ({
      label: subdivision.name,
      value: subdivision.code.includes("-")
        ? subdivision.code
        : `${filters.country}-${subdivision.code}`,
    }));
  }, [filters.country]);

  const toggleSection = (section: FilterSection) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((value) => value !== section)
        : [...prev, section]
    );
  };

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleStatus = (value: Filters["status"][number]) => {
    const next = filters.status.includes(value)
      ? filters.status.filter((item) => item !== value)
      : [...filters.status, value];
    updateFilter("status", next);
  };

  const toggleAuctionPreset = (value: Filters["auctionStatus"][number]) => {
    const next = filters.auctionStatus.includes(value)
      ? filters.auctionStatus.filter((item) => item !== value)
      : [...filters.auctionStatus, value];
    updateFilter("auctionStatus", next);
  };

  const toggleShipping = (value: Filters["shipping"][number]) => {
    const next = filters.shipping.includes(value)
      ? filters.shipping.filter((item) => item !== value)
      : [...filters.shipping, value];
    updateFilter("shipping", next);
  };

  const toggleCategory = (value: string) => {
    const next = filters.categories.includes(value)
      ? filters.categories.filter((item) => item !== value)
      : [...filters.categories, value];
    updateFilter("categories", next);
  };

  const toggleLotType = (value: Filters["lotType"][number]) => {
    const next = filters.lotType.includes(value)
      ? filters.lotType.filter((item) => item !== value)
      : [...filters.lotType, value];
    updateFilter("lotType", next);
  };

  const handleCountryChange = (value: string) => {
    if (value === "all") {
      onFiltersChange({
        ...filters,
        country: "all",
        state: "all",
      });
      return;
    }

    const nextState = filters.state.startsWith(`${value}-`) ? filters.state : "all";
    onFiltersChange({
      ...filters,
      country: value,
      state: nextState,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange(getDefaultListingFilters());
  };

  const activeFiltersCount = countActiveListingFilters(filters);
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide sticky top-28">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={type === "auction" ? "Search auctions..." : "Search lots..."}
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Collapsible
          open={openSections.includes("location")}
          onOpenChange={() => toggleSection("location")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Location</Label>
            {openSections.includes("location") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Country</Label>
              <Select value={filters.country} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-background max-h-80">
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">State / province</Label>
              <Select
                value={filters.state}
                onValueChange={(value) => updateFilter("state", value)}
                disabled={filters.country === "all"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      filters.country === "all"
                        ? "Select a country first"
                        : "State / province"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-background max-h-80">
                  <SelectItem value="all">All states</SelectItem>
                  {subdivisionOptions.map((subdivision) => (
                    <SelectItem key={subdivision.value} value={subdivision.value}>
                      {subdivision.label} ({subdivision.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ZIP / postal code"
                value={filters.zipCode}
                onChange={(e) => updateFilter("zipCode", e.target.value)}
                className="pl-9"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("status")}
          onOpenChange={() => toggleSection("status")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Status</Label>
            {openSections.includes("status") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1 space-y-4">
            <div>
              <div className="space-y-2">
                {auctionPresetOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`preset-${option.value}`}
                      checked={filters.auctionStatus.includes(option.value)}
                      onCheckedChange={() => toggleAuctionPreset(option.value)}
                    />
                    <Label htmlFor={`preset-${option.value}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {filters.auctionStatus.includes("closing_soon") && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Closing soon hours
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="48"
                  value={filters.closingSoonHours}
                  onChange={(e) => updateFilter("closingSoonHours", e.target.value)}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("shipping")}
          onOpenChange={() => toggleSection("shipping")}
        >
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
              {shippingOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`shipping-${option.value}`}
                    checked={filters.shipping.includes(option.value)}
                    onCheckedChange={() => toggleShipping(option.value)}
                  />
                  <Label htmlFor={`shipping-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("date")}
          onOpenChange={() => toggleSection("date")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Dates</Label>
            {openSections.includes("date") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Date range (`date_from`, `date_to`)
              </Label>
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
                    selected={filters.dateRange ?? undefined}
                    onSelect={(range) => updateFilter("dateRange", range ?? null)}
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
                  <X className="h-3 w-3 mr-1" /> Clear date range
                </Button>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Starts after
              </Label>
              <Input
                type="datetime-local"
                value={filters.startsAfter}
                onChange={(e) => updateFilter("startsAfter", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Ends before
              </Label>
              <Input
                type="datetime-local"
                value={filters.endsBefore}
                onChange={(e) => updateFilter("endsBefore", e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("categories")}
          onOpenChange={() => toggleSection("categories")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Categories</Label>
            {openSections.includes("categories") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1 space-y-3">
            <div className="space-y-2 pr-1">
              {allCategories.map((category) => (
                <div key={category.slug} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category.slug}`}
                    checked={filters.categories.includes(category.slug)}
                    onCheckedChange={() => toggleCategory(category.slug)}
                  />
                  <Label htmlFor={`category-${category.slug}`} className="text-sm cursor-pointer">
                    {category.parent_id ? `  ${category.name}` : category.name}
                  </Label>
                </div>
              ))}
            </div>

            {filters.categories.length > 1 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Category mode (`category_mode`)
                </Label>
                <Select
                  value={filters.categoryMode}
                  onValueChange={(value) => updateFilter("categoryMode", value as Filters["categoryMode"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {categoryModeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("lotType")}
          onOpenChange={() => toggleSection("lotType")}
        >
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
                    id={`lot-type-${option.value}`}
                    checked={filters.lotType.includes(option.value)}
                    onCheckedChange={() => toggleLotType(option.value)}
                  />
                  <Label htmlFor={`lot-type-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("advanced")}
          onOpenChange={() => toggleSection("advanced")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Advanced</Label>
            {openSections.includes("advanced") ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Currency
              </Label>
              <Input
                placeholder="USD"
                value={filters.currency}
                onChange={(e) => updateFilter("currency", e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active-only"
                  checked={filters.activeOnly}
                  onCheckedChange={(checked) => updateFilter("activeOnly", checked === true)}
                />
                <Label htmlFor="active-only" className="text-sm cursor-pointer">
                  Active only
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AuctionFilters;
