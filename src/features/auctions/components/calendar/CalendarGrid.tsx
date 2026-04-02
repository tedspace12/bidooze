import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarAuction } from "../../data/auctionCalendarData";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  auctionsMap: Map<string, CalendarAuction[]>;
  onDateSelect: (date: Date) => void;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_OF_WEEK_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

const CalendarGrid = ({
  currentDate,
  selectedDate,
  auctionsMap,
  onDateSelect,
}: CalendarGridProps) => {
  const isMobile = useIsMobile();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get starting day (0 = Sunday, but we want Monday = 0)
  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay < 0) startingDay = 6;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const getDayData = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const auctions = auctionsMap.get(dateKey) || [];
    const hasLive = auctions.some(
      (a) => a.status === "live" || a.status === "paused" || a.status === "scheduled"
    );
    const allClosed = auctions.length > 0 && auctions.every((a) => a.status === "closed");

    return { dateKey, auctionCount: auctions.length, hasLive, allClosed };
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateKey === todayStr;
  };

  const cells = [];

  // Empty cells for days before the first day of month
  for (let i = 0; i < startingDay; i++) {
    cells.push(<div key={`empty-${i}`} className={cn(
      "bg-muted/30 rounded-lg",
      isMobile ? "h-12" : "h-20"
    )} />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const { auctionCount, hasLive, allClosed } = getDayData(day);
    const selected = isSelected(day);
    const todayFlag = isToday(day);

    cells.push(
      <button
        key={day}
        onClick={() => onDateSelect(new Date(year, month, day))}
        className={cn(
          "rounded-lg border transition-all flex flex-col items-center justify-center gap-0.5 hover:border-primary/50",
          isMobile ? "h-12 p-1" : "h-20 gap-1",
          selected && "border-primary bg-primary/5 ring-1 ring-primary",
          !selected && "border-border bg-card hover:bg-accent/10",
          todayFlag && !selected && "border-primary/30"
        )}
      >
        <span
          className={cn(
            "font-medium",
            isMobile ? "text-xs" : "text-sm",
            selected && "text-primary",
            todayFlag && !selected && "text-primary",
            !selected && !todayFlag && "text-foreground"
          )}
        >
          {day}
        </span>
        {auctionCount > 0 && (
          <span
            className={cn(
              "rounded-full font-medium",
              isMobile ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5",
              hasLive && "bg-primary text-primary-foreground",
              allClosed && "bg-muted text-muted-foreground",
              !hasLive && !allClosed && "bg-primary/20 text-primary"
            )}
          >
            {auctionCount}
          </span>
        )}
      </button>
    );
  }

  const daysLabels = isMobile ? DAYS_OF_WEEK_SHORT : DAYS_OF_WEEK;

  return (
    <div className="space-y-2 md:space-y-3">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {daysLabels.map((day, idx) => (
          <div
            key={`${day}-${idx}`}
            className={cn("flex items-center justify-center font-medium text-muted-foreground uppercase tracking-wide",
               isMobile ? "h-6 text-[10px]" : "h-8 text-xs"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {cells}
      </div>
    </div>
  );
};

export default CalendarGrid;
