import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader = ({ currentDate, onPreviousMonth, onNextMonth }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-foreground">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
