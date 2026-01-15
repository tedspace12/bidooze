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
          <Badge className="bg-primary text-primary-foreground text-[10px] md:text-xs py-px md:py-0.5">Live</Badge>
        );
      case "ending-soon":
        return (
          <Badge className="bg-destructive text-white text-[10px] md:text-xs py-px md:py-0.5">Ending Soon</Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" className="text-muted-foreground text-[10px] md:text-xs py-px md:py-0.5">Closed</Badge>
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

  const formatDateShort = (date: Date) => {
    const day = date.getDate();
    const suffix = 
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";
    
    return `${format(date, "EEE")}, ${day}${suffix} ${format(date, "MMM")}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 h-fit lg:sticky lg:top-28">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm md:text-base">Daily Schedule</h3>
          <p className="text-xs md:text-sm text-muted-foreground truncate md:whitespace-normal">
            <span className="hidden md:inline">{formatDateFull(selectedDate)}</span>
            <span className="md:hidden">{formatDateShort(selectedDate)}</span>
          </p>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base">No auctions scheduled</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Select another date to view auctions
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className={cn(
                "p-3 md:p-4 rounded-lg border transition-colors",
                auction.status === "closed" 
                  ? "border-border bg-muted/30" 
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                <h4 className="font-medium text-foreground text-xs md:text-sm leading-tight line-clamp-2">
                  {auction.name}
                </h4>
                {getStatusBadge(auction.status)}
              </div>
              
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Avatar className="h-5 w-5 md:h-6 md:w-6">
                  <AvatarImage src={auction.auctioneer.image} alt={auction.auctioneer.name} />
                  <AvatarFallback className="text-[10px] md:text-xs">
                    {auction.auctioneer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs md:text-sm text-muted-foreground truncate">
                  {auction.auctioneer.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                  {auction.time}
                </div>
                <Button
                  size="sm"
                  variant={auction.status === "closed" ? "outline" : "default"}
                  onClick={() => router.push(auction.catalogUrl)}
                  className="h-6 sm:h-7 md:h-8 text-xs px-2 md:px-3"
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
