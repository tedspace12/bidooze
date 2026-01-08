import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BidsFiltersProps {
  auctionFilter: string;
  statusFilter: string;
  groupByAuction: boolean;
  hideClosedLots: boolean;
  pastBidsFilter: string;
  onAuctionFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onGroupByAuctionChange: (value: boolean) => void;
  onHideClosedLotsChange: (value: boolean) => void;
  onPastBidsFilterChange: (value: string) => void;
}

const BidsFilters = ({
  auctionFilter,
  statusFilter,
  groupByAuction,
  hideClosedLots,
  pastBidsFilter,
  onAuctionFilterChange,
  onStatusFilterChange,
  onGroupByAuctionChange,
  onHideClosedLotsChange,
  onPastBidsFilterChange,
}: BidsFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    auction: true,
    status: true,
    additional: true,
    pastBids: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      {/* Auction Filter */}
      <Collapsible open={openSections.auction} onOpenChange={() => toggleSection("auction")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <span className="font-medium">Auction Filter</span>
            {openSections.auction ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <RadioGroup value={auctionFilter} onValueChange={onAuctionFilterChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="auction-all" />
              <Label htmlFor="auction-all" className="text-sm">All auctions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followed" id="auction-followed" />
              <Label htmlFor="auction-followed" className="text-sm">Followed auctions</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Status Filter */}
      <Collapsible open={openSections.status} onOpenChange={() => toggleSection("status")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <span className="font-medium">Status Filter</span>
            {openSections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <RadioGroup value={statusFilter} onValueChange={onStatusFilterChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="text-sm">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="watching" id="status-watching" />
              <Label htmlFor="status-watching" className="text-sm">Only watching</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="winning" id="status-winning" />
              <Label htmlFor="status-winning" className="text-sm">Winning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="status-pending" />
              <Label htmlFor="status-pending" className="text-sm">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outbid" id="status-outbid" />
              <Label htmlFor="status-outbid" className="text-sm">Outbid</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Additional Filters */}
      <Collapsible open={openSections.additional} onOpenChange={() => toggleSection("additional")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <span className="font-medium">Additional Filters</span>
            {openSections.additional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="group-by-auction" 
              checked={groupByAuction}
              onCheckedChange={onGroupByAuctionChange}
            />
            <Label htmlFor="group-by-auction" className="text-sm">Group by auction</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hide-closed" 
              checked={hideClosedLots}
              onCheckedChange={onHideClosedLotsChange}
            />
            <Label htmlFor="hide-closed" className="text-sm">Hide closed lots</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Past Bids Filter */}
      <Collapsible open={openSections.pastBids} onOpenChange={() => toggleSection("pastBids")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <span className="font-medium">Past Bids</span>
            {openSections.pastBids ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <RadioGroup value={pastBidsFilter} onValueChange={onPastBidsFilterChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="past-3" />
              <Label htmlFor="past-3" className="text-sm">Past 3 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6" id="past-6" />
              <Label htmlFor="past-6" className="text-sm">Past 6 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12" id="past-12" />
              <Label htmlFor="past-12" className="text-sm">Past 12 months</Label>
            </div>
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BidsFilters;