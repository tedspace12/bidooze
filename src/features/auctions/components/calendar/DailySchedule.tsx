import { format } from "date-fns";
import { CalendarAuction } from "../../data/auctionCalendarData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DailyScheduleProps {
  selectedDate: Date;
  auctions: CalendarAuction[];
}

const DailySchedule = ({ selectedDate, auctions }: DailyScheduleProps) => {
  const router = useRouter();
  
  const getStatusBadge = (status: CalendarAuction["status"]) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-primary text-primary-foreground">Live</Badge>
        );
      case "ending-soon":
        return (
          <Badge className="bg-destructive text-destructive-foreground">Ending Soon</Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" className="text-muted-foreground">Closed</Badge>
        );
    }
  };

  const formatDateFull = (date: Date) => {
    const day = date.getDate();
    const suffix = 
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";
    
    return `${format(date, "EEEE")}, ${day}${suffix} ${format(date, "MMMM yyyy")}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Daily Schedule</h3>
          <p className="text-sm text-muted-foreground">
            {formatDateFull(selectedDate)}
          </p>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No auctions scheduled</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select another date to view auctions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className={cn(
                "p-4 rounded-lg border transition-colors",
                auction.status === "closed" 
                  ? "border-border bg-muted/30" 
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-medium text-foreground text-sm leading-tight">
                  {auction.name}
                </h4>
                {getStatusBadge(auction.status)}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={auction.auctioneer.image} alt={auction.auctioneer.name} />
                  <AvatarFallback className="text-xs">
                    {auction.auctioneer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {auction.auctioneer.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {auction.time}
                </div>
                <Button
                  size="sm"
                  variant={auction.status === "closed" ? "outline" : "default"}
                  onClick={() => router.push(auction.catalogUrl)}
                  className="h-8 text-xs"
                >
                  View Catalog
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
