import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import BidConfirmationModal from "./modal/BidConfirmationModal";

interface BiddingActionsProps {
  currentBid: number;
  bidIncrements: { range: string; increment: string }[];
  startTime: string;
  endTime: string;
  id: string;
  title: string;
  images: string[];
}


const BiddingActions = ({
  currentBid,
  bidIncrements,
  startTime,
  endTime,
  id,
  title,
  images,
}: BiddingActionsProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [showIncrements, setShowIncrements] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);

  const minBid = currentBid + 2500; // Based on current increment

  // Mock data for bid confirmation modal
  const lotDataForModal = {
    id: '1',
    lotId: id,
    title: title,
    images: images,
    currentBid: currentBid,
    minBidIncrement: minBid,
    buyersPremium: "15%",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-3 md:space-y-5">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Place Your Bid</h3>

        {/* Bid Input */}
        <div className="space-y-3">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="number"
              placeholder={`Min: $${minBid.toLocaleString()}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="pl-10 text-sm md:text-lg h-12"
            />
          </div>
          <Button onClick={() => setBidModalOpen(true)} className="w-full h-12 text-sm md:text-base font-semibold">
            Place Bid
          </Button>
        </div>

        {/* Bid Increments */}
        <Collapsible open={showIncrements} onOpenChange={setShowIncrements}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-muted-foreground hover:text-foreground text-xs md:text-sm"
            >
              View Bid Increments
              {showIncrements ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              {bidIncrements.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs md:text-sm"
                >
                  <span className="text-muted-foreground">{item.range}</span>
                  <span className="font-medium text-foreground">{item.increment}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Auction Dates */}
        <div className="border-t border-border pt-5 space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Bidding Starts</p>
              <p className="text-sm font-medium text-foreground">{formatDate(startTime)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-destructive mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Bidding Ends</p>
              <p className="text-sm font-medium text-foreground">{formatDate(endTime)}</p>
            </div>
          </div>
        </div>
      </div>

      <BidConfirmationModal
        open={bidModalOpen}
        onOpenChange={setBidModalOpen}
        lot={lotDataForModal}
      />
    </>
  );
};

export default BiddingActions;
