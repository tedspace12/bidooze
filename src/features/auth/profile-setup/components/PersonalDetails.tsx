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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Be ready to bid. Let&apos;s get started.</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Auctioneers use this info to approve bidders. Get set up now so you&apos;re ready to bid the moment it counts.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="text-sm sm:text-base font-medium">Personal Information</span>
            <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${openSections.personal ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 px-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name</Label>
                <Input id="firstName" placeholder="John" className="text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="text-sm" />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+1">
                  <SelectTrigger className="w-20 sm:w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+61">+61</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" placeholder="(555) 123-4567" className="flex-1 text-sm" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.address} onOpenChange={() => toggleSection("address")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="text-sm sm:text-base font-medium">Address</span>
            <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${openSections.address ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 px-1">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="addressSearch">Search Address</Label>
              <Input id="addressSearch" placeholder="Start typing your address..." className="text-sm" />
            </div>
            <button className="text-xs sm:text-sm text-primary hover:underline">+ Add manually</button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.card} onOpenChange={() => toggleSection("card")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
            <span className="text-sm sm:text-base font-medium">Card Details</span>
            <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${openSections.card ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 px-1">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="cardHolder" className="text-xs sm:text-sm">Card Holder</Label>
              <Input id="cardHolder" placeholder="John Doe" className="text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="cardNumber" className="text-xs sm:text-sm">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="expiration" className="text-xs sm:text-sm">Expiration Date</Label>
                <Input id="expiration" placeholder="MM/YY" className="text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="cvv" className="text-xs sm:text-sm">CVV</Label>
                <Input id="cvv" placeholder="123" maxLength={3} className="text-sm" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PersonalDetails;
