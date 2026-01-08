import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, ExternalLink } from "lucide-react";

interface AuctioneerInfoProps {
  auctioneer: {
    name: string;
    logo: string;
    rating: number;
    totalAuctions: number;
  };
}

const AuctioneerInfo = ({ auctioneer }: AuctioneerInfoProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Auctioneer</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={auctioneer.logo} alt={auctioneer.name} />
          <AvatarFallback>{auctioneer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">{auctioneer.name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{auctioneer.rating}</span>
            </div>
            <span>·</span>
            <span>{auctioneer.totalAuctions.toLocaleString()} auctions</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-2">
          <MessageCircle className="h-4 w-4" />
          Contact
        </Button>
        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AuctioneerInfo;
