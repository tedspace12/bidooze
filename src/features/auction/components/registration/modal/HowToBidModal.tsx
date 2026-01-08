import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HowToBidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowToBidModal = ({ open, onOpenChange }: HowToBidModalProps) => {
  const steps = [
    {
      title: "Register for the Auction",
      description: "Complete your registration by verifying your payment method and agreeing to the auction terms.",
    },
    {
      title: "Browse the Catalog",
      description: "Explore available lots, view details, estimates, and add items to your watchlist.",
    },
    {
      title: "Place Your Bid",
      description: "Enter your maximum bid amount. The system will automatically bid on your behalf up to this amount.",
    },
    {
      title: "Monitor Your Bids",
      description: "Track your bids in real-time. You'll be notified if you're outbid so you can place a higher bid.",
    },
    {
      title: "Win & Pay",
      description: "If you're the highest bidder when the auction closes, complete your payment and arrange pickup or shipping.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Bid</DialogTitle>
          <DialogDescription>
            Follow these simple steps to participate in the auction
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HowToBidModal;
