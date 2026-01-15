import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useState, ReactNode } from "react";

interface FilterDrawerProps {
  children: ReactNode;
  title?: string;
  activeFiltersCount?: number;
  onApply?: () => void;
  onClear?: () => void;
}

const FilterDrawer = ({ 
  children, 
  title = "Filters",
  activeFiltersCount = 0,
  onApply,
  onClear 
}: FilterDrawerProps) => {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply?.();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col">
        <SheetHeader className="pb-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center justify-between">
            {title}
            {activeFiltersCount > 0 && onClear && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClear}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4 -mx-2 px-6 min-h-0">
          {children}
        </div>

        <SheetFooter className="pt-4 border-t border-border -mx-2 px-6 shrink-0">
          <Button className="w-full" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
