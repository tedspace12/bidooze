import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Nigeria", "South Africa", "India", "Japan"
];

const usStates = [
  "Alabama", "Alaska", "Arizona", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
  "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const PaymentAddress = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "visa", lastFour: "4242", expiry: "12/26", isDefault: true },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    name: "John Doe",
    country: "United States",
    address: "123 Main Street",
    city: "New York",
    state: "New York",
    zip: "10001",
    phone: "+1 555 123 4567",
  });

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "Amex";
      default:
        return "Card";
    }
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.expiry) {
      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: "visa",
        lastFour: newCard.cardNumber.slice(-4),
        expiry: newCard.expiry,
        isDefault: paymentMethods.length === 0,
      };
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setNewCard({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
      setShowAddCard(false);
    }
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleBillingChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveBilling = () => {
    console.log("Saving billing address:", billingAddress);
  };

  return (
    <div className="space-y-8">
      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        
        {/* Existing Cards */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-14 bg-secondary rounded flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getCardIcon(method.type)}</span>
                    <span className="text-muted-foreground">•••• {method.lastFour}</span>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Expires {method.expiry}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveCard(method.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Card */}
        <Collapsible open={showAddCard} onOpenChange={setShowAddCard}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Payment Method
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="border border-border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input 
                  id="cardHolder" 
                  placeholder="John Doe"
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    maxLength={4}
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCard}>Add Card</Button>
                <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="billingName">Name</Label>
            <Input 
              id="billingName" 
              value={billingAddress.name}
              onChange={(e) => handleBillingChange("name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="billingCountry">Country</Label>
            <Select 
              value={billingAddress.country} 
              onValueChange={(value) => handleBillingChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Address</Label>
            <Input 
              id="billingAddress" 
              value={billingAddress.address}
              onChange={(e) => handleBillingChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingCity">City</Label>
              <Input 
                id="billingCity" 
                value={billingAddress.city}
                onChange={(e) => handleBillingChange("city", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingState">State</Label>
              <Select 
                value={billingAddress.state} 
                onValueChange={(value) => handleBillingChange("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-background max-h-60">
                  {usStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingZip">Zip Code</Label>
              <Input 
                id="billingZip" 
                value={billingAddress.zip}
                onChange={(e) => handleBillingChange("zip", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingPhone">Phone Number</Label>
            <Input 
              id="billingPhone" 
              value={billingAddress.phone}
              onChange={(e) => handleBillingChange("phone", e.target.value)}
            />
          </div>

          <Button onClick={handleSaveBilling}>Save Billing Address</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentAddress;
