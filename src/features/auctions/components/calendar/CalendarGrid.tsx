import { CalendarAuction } from "../../data/auctionCalendarData";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  auctionsMap: Map<string, CalendarAuction[]>;
  onDateSelect: (date: Date) => void;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CalendarGrid = ({
  currentDate,
  selectedDate,
  auctionsMap,
  onDateSelect,
}: CalendarGridProps) => {
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
    const hasLive = auctions.some((a) => a.status === "live" || a.status === "ending-soon");
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
    cells.push(<div key={`empty-${i}`} className="h-20 bg-muted/30 rounded-lg" />);
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
          "h-20 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 hover:border-primary/50",
          selected && "border-primary bg-primary/5 ring-1 ring-primary",
          !selected && "border-border bg-card hover:bg-accent/10",
          todayFlag && !selected && "border-primary/30"
        )}
      >
        <span
          className={cn(
            "text-sm font-medium",
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
              "text-xs px-2 py-0.5 rounded-full font-medium",
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

  return (
    <div className="space-y-3">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells}
      </div>
    </div>
  );
};

export default CalendarGrid;
