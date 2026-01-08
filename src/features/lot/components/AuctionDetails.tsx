import { MapPin, Calendar, Award, Percent, FileText } from "lucide-react";

interface AuctionDetailsProps {
  auction: {
    name: string;
    type: string;
    date: string;
    time: string;
    location: string;
    buyerPremium: string;
  };
}

const AuctionDetails = ({ auction }: AuctionDetailsProps) => {
  const details = [
    { icon: FileText, label: "Auction", value: auction.name },
    { icon: Award, label: "Auction Type", value: auction.type },
    { icon: Calendar, label: "Date & Time", value: `${auction.date} at ${auction.time}` },
    { icon: MapPin, label: "Location", value: auction.location },
    { icon: Percent, label: "Buyer Premium", value: auction.buyerPremium },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-5">Auction Details</h3>
      
      <div className="grid gap-4">
        {details.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-medium text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionDetails;
