import { RefreshCw, TrendingUp, AlertTriangle, Eye, CheckCircle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BidsSummaryProps {
  stats: {
    winningHighBid: number;
    winningMaxBid: number;
    winning: number;
    total_bids: number;
    losingDeclined: number;
    watched: number;
    winningBreakdown?: {
      manual: number;
      auto: number;
    };
    wonLots?: number;
    lostLots?: number;
  };
  onRefresh: () => void;
}

const BidsSummary = ({ stats, onRefresh }: BidsSummaryProps) => {
  const summaryItems = [
    { 
      label: "Winning Now", 
      value: stats.winning, 
      icon: TrendingUp, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      subtext: stats.winningBreakdown ? `Manual: ${stats.winningBreakdown.manual}, Auto: ${stats.winningBreakdown.auto}` : undefined,
    },
    { 
      label: "Won Lots", 
      value: stats.wonLots ?? 0, 
      icon: CheckCircle, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: "Lost Lots", 
      value: stats.lostLots ?? 0, 
      icon: AlertTriangle, 
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    { 
      label: "Outbid", 
      value: stats.losingDeclined, 
      icon: AlertTriangle, 
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      label: "Total Bids",
      value: stats.total_bids,
      icon: ArrowUpDown,
      color: "text-gray-500",
      bg: "bg-gray-500/10"
    },
    { 
      label: "Watched Lots", 
      value: stats.watched, 
      icon: Eye, 
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Bid Summary</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryItems.map((item) => (
          <div 
            key={item.label} 
            className={`${item.bg} rounded-lg p-3 text-center`}
          >
            <item.icon className={`h-5 w-5 mx-auto mb-2 ${item.color}`} />
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            {item.subtext && (
              <p className="text-xs text-muted-foreground mt-2 border-t border-foreground/10 pt-2">{item.subtext}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BidsSummary;