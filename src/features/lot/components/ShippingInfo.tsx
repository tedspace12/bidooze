import { Truck, Package, MapPin, Clock, DollarSign } from "lucide-react";

interface ShippingInfoProps {
  shippingAvailable: boolean;
  shippingCost?: string;
  estimatedDelivery?: string;
  pickupLocation?: string;
  shippingNotes?: string;
}

const ShippingInfo = ({ 
  shippingAvailable, 
  shippingCost = "Contact for quote",
  estimatedDelivery = "5-10 business days",
  pickupLocation = "Scottsdale, Arizona",
  shippingNotes = "Professional shipping and white-glove delivery available for this item. Insurance included in shipping quote."
}: ShippingInfoProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Shipping Information</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Shipping Status</p>
            <p className="font-medium text-foreground">
              {shippingAvailable ? "Shipping Available" : "Local Pickup Only"}
            </p>
          </div>
        </div>

        {shippingAvailable && (
          <>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shipping Cost</p>
                <p className="font-medium text-foreground">{shippingCost}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium text-foreground">{estimatedDelivery}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pickup Location</p>
            <p className="font-medium text-foreground">{pickupLocation}</p>
          </div>
        </div>

        {shippingNotes && (
          <p className="text-sm text-muted-foreground pt-2 border-t border-border">
            {shippingNotes}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
