import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { auctioneers, auctionTypes } from "../../data/auctionCalendarData";

interface CalendarFiltersProps {
  selectedAuctioneers: string[];
  selectedTypes: string[];
  onAuctioneersChange: (ids: string[]) => void;
  onTypesChange: (ids: string[]) => void;
}

const CalendarFilters = ({
  selectedAuctioneers,
  selectedTypes,
  onAuctioneersChange,
  onTypesChange,
}: CalendarFiltersProps) => {
  const handleAuctioneerToggle = (id: string) => {
    if (selectedAuctioneers.includes(id)) {
      onAuctioneersChange(selectedAuctioneers.filter((a) => a !== id));
    } else {
      onAuctioneersChange([...selectedAuctioneers, id]);
    }
  };

  const handleTypeToggle = (id: string) => {
    if (selectedTypes.includes(id)) {
      onTypesChange(selectedTypes.filter((t) => t !== id));
    } else {
      onTypesChange([...selectedTypes, id]);
    }
  };

  const totalFilters = selectedAuctioneers.length + selectedTypes.length;

  return (
    <div className="flex items-center gap-3 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Auctioneer
            {selectedAuctioneers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {selectedAuctioneers.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 bg-background" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-foreground">Auctioneers</h4>
            <div className="space-y-2">
              {auctioneers.map((auctioneer) => (
                <div key={auctioneer.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`auctioneer-${auctioneer.id}`}
                    checked={selectedAuctioneers.includes(auctioneer.id)}
                    onCheckedChange={() => handleAuctioneerToggle(auctioneer.id)}
                  />
                  <label
                    htmlFor={`auctioneer-${auctioneer.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {auctioneer.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Auction Type
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-background" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-foreground">Auction Types</h4>
            <div className="space-y-2">
              {auctionTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleTypeToggle(type.id)}
                  />
                  <label
                    htmlFor={`type-${type.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {totalFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onAuctioneersChange([]);
            onTypesChange([]);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default CalendarFilters;
