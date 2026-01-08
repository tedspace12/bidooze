import { AlertTriangle } from "lucide-react";

const BiddingNotice = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Important Bidding Notice</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• All bids are binding and cannot be retracted.</li>
            <li>• A 15% buyer&apos;s premium applies to all purchases.</li>
            <li>• Payment is due within 5 business days of auction close.</li>
            <li>• Inspection is available by appointment only.</li>
            <li>• By bidding, you agree to the auction terms & conditions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BiddingNotice;
