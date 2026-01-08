import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PersonalDetails = () => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    address: false,
    card: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Be ready to bid. Let&apos;s get started.</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Auctioneers use this info to approve bidders. Get set up now so you&apos;re ready to bid the moment it counts.
        </p>
      </div>

      <div className="space-y-4">
        <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="font-medium">Personal Information</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openSections.personal ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+1">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+61">+61</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" placeholder="(555) 123-4567" className="flex-1" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.address} onOpenChange={() => toggleSection("address")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="font-medium">Address</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openSections.address ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressSearch">Search Address</Label>
              <Input id="addressSearch" placeholder="Start typing your address..." />
            </div>
            <button className="text-sm text-primary hover:underline">+ Add manually</button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.card} onOpenChange={() => toggleSection("card")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="font-medium">Card Details</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openSections.card ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder</Label>
              <Input id="cardHolder" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input id="expiration" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" maxLength={3} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PersonalDetails;
