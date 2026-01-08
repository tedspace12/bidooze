import { useState, useEffect } from "react";
import { Clock, Gavel, Truck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BidSummaryProps {
  currentBid: number;
  bidsCount: number;
  endTime: string;
  closeType: string;
  shippingAvailable: boolean;
}

const BidSummary = ({ 
  currentBid, 
  bidsCount, 
  endTime, 
  closeType, 
  shippingAvailable 
}: BidSummaryProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* Time Remaining */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <span className="text-lg font-bold text-destructive">{timeRemaining}</span>
      </div>

      {/* Current Bid */}
      <div className="border-t border-border pt-5">
        <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
        <p className="text-3xl font-bold text-foreground">
          ${currentBid.toLocaleString()}
        </p>
      </div>

      {/* Bids Count */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Gavel className="h-4 w-4" />
        <span className="text-sm">{bidsCount} bids placed</span>
      </div>

      {/* Indicators */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="secondary" className="gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {closeType}
        </Badge>
        {shippingAvailable && (
          <Badge variant="outline" className="gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Shipping Available
          </Badge>
        )}
      </div>
    </div>
  );
};

export default BidSummary;
