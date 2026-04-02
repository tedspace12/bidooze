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
    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <h3 className="text-base md:text-lg font-semibold text-foreground">Shipping Information</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Shipping Status</p>
            <p className="text-sm md:text-base font-medium text-foreground">
              {shippingAvailable ? "Shipping Available" : "Local Pickup Only"}
            </p>
          </div>
        </div>

        {shippingAvailable && (
          <>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shipping Cost</p>
                <p className="text-sm md:text-base font-medium text-foreground">{shippingCost}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="text-sm md:text-base font-medium text-foreground">{estimatedDelivery}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-start gap-3">
          <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pickup Info</p>
            <p className="text-sm md:text-base font-medium text-foreground">{pickupLocation}</p>
          </div>
        </div>

        {shippingNotes && (
          <p className="text-xs md:text-sm text-muted-foreground pt-2 border-t border-border">
            {shippingNotes}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
