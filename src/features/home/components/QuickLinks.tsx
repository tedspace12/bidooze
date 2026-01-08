import { ChevronRight } from "lucide-react";

const quickLinks = [
  "All Categories",
  "Today's Events",
  "Auctions Near Me",
  "Auctions by State",
  "Company Search",
];

const QuickLinks = () => {
  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 h-12 overflow-x-auto scrollbar-hide">
          {quickLinks.map((link) => (
            <button
              key={link}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground whitespace-nowrap hover:text-primary transition-colors"
            >
              {link}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
