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
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{auction.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={auction.auctioneer.avatar} />
                <AvatarFallback>{auction.auctioneer.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{auction.auctioneer.name}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(auction.date), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
      <Link href={`/auction/${auction.id}`}>
        <Button variant="outline" size="sm">
          View Catalog
        </Button>
      </Link>
    </div>
  );
};

export default AuctionGroupHeader;