import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface AuctionGroupHeaderProps {
  auction: {
    id: string;
    title: string;
    auctioneer: { name: string; avatar: string };
    date: string;
  };
}

const AuctionGroupHeader = ({ auction }: AuctionGroupHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg mb-4">
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{auction.title}</h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
              <AvatarImage src={auction.auctioneer.avatar} />
              <AvatarFallback className="text-[10px] sm:text-xs">{auction.auctioneer.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm text-muted-foreground">{auction.auctioneer.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{format(new Date(auction.date), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>
      <Link href={`/auction/${auction.id}`} className="self-start sm:self-auto shrink-0">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
          View Catalog
        </Button>
      </Link>
    </div>
  );
};

export default AuctionGroupHeader;