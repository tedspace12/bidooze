import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Loader2, MapPin, Edit, X, Check, ShieldCheck } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import {
  countries,
  getCountryByCode,
  getSubdivisionsByCountry,
  type Country,
  type Subdivision,
} from "@/lib/locationData";

interface PaymentMethod {
  id: number;
  card_holder_name: string;
  card_last_four: string;
  expiration_date: string;
  card_brand: string;
  provider: string;
  ref: string | null;
  is_verified: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface BillingAddress {
  id: number;
  name: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  zip_code: string;
  phone_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const PaymentAddress = () => {
  const {
    getPaymentMethods,
    addPaymentMethod,
    setDefaultPaymentMethod,
    verifyPaymentMethod,
    deletePaymentMethod,
    getBillingAddresses,
    addBillingAddress,
    updateBillingAddress,
    deleteBillingAddress,
  } = useAuth();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<BillingAddress | null>(null);
  const [newCard, setNewCard] = useState({
    provider: "",
    card_holder_name: "",
    card_number: "",
    expiration_date: "",
    cvv: "",
    is_default: false,
  });
  const [newAddress, setNewAddress] = useState({
    name: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone_number: "",
    is_default: false,
  });

  useEffect(() => {
    loadPaymentMethods();
    loadBillingAddresses();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await getPaymentMethods.mutateAsync();
      setPaymentMethods(response.payment_methods || []);
    } catch (error: any) {
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const loadBillingAddresses = async () => {
    try {
      const response = await getBillingAddresses.mutateAsync();
      const addresses = (response.billing_addresses || []).map((address: any) => ({
        ...address,
        is_default: Boolean(address.is_default)
      }));
      setBillingAddresses(addresses);
    } catch (error: any) {
      toast.error("Failed to load billing addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
      case "american_express":
        return "Amex";
      case "discover":
        return "Discover";
      default:
        return "Card";
    }
  };

  const handleAddCard = async () => {
    if (!newCard.card_holder_name || !newCard.card_number || !newCard.expiration_date || !newCard.cvv) {
      toast.error("Please fill in all card details");
      return;
    }

    if (!newCard.provider) {
      toast.error("Please select a verification method");
      return;
    }

    try {
      await addPaymentMethod.mutateAsync(newCard);
      toast.success("Payment method added successfully");
      setNewCard({
        provider: "",
        card_holder_name: "",
        card_number: "",
        expiration_date: "",
        cvv: "",
        is_default: false,
      });
      setShowAddCard(false);
      loadPaymentMethods(); // Refresh the list
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSetDefault = async (paymentMethodId: number) => {
    try {
      await setDefaultPaymentMethod.mutateAsync({
        paymentMethodId,
        data: { is_default: true }
      });
      toast.success("Default payment method updated");
      loadPaymentMethods();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleVerifyCard = async (paymentMethodId: number) => {
    try{
      await verifyPaymentMethod.mutateAsync({
        paymentMethodId
      });
      toast.success("Payment method verified successfully");
      loadPaymentMethods();
    }
    catch (error: any) {
      toast.error(getErrorMessage(error));
    };
  }

  const handleRemoveCard = async (paymentMethodId: number) => {
    try {
      await deletePaymentMethod.mutateAsync(paymentMethodId);
      toast.success("Payment method deleted successfully");
      loadPaymentMethods(); // Refresh the list
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.country || !newAddress.address || !newAddress.city || !newAddress.zip_code) {
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      await addBillingAddress.mutateAsync(newAddress);
      toast.success("Billing address added successfully");
      setNewAddress({
        name: "",
        country: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone_number: "",
        is_default: false,
      });
      setShowAddAddress(false);
      loadBillingAddresses(); // Refresh the list
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;

    const updateData = {
      name: editingAddress.name,
      country: editingAddress.country,
      address: editingAddress.address,
      city: editingAddress.city,
      state: editingAddress.state,
      zip_code: editingAddress.zip_code,
      phone_number: editingAddress.phone_number,
      is_default: editingAddress.is_default,
    };

    try {
      await updateBillingAddress.mutateAsync({
        billingAddressId: editingAddress.id,
        data: updateData
      });
      toast.success("Billing address updated successfully");
      setEditingAddress(null);
      loadBillingAddresses();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteBillingAddress.mutateAsync(addressId);
      toast.success("Billing address deleted successfully");
      loadBillingAddresses(); // Refresh the list
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const getErrorMessage = (error: any): string => {
    // Check if there are specific validation errors
    if (error?.errors && typeof error.errors === 'object') {
      const errorMessages = Object.values(error.errors) as string[][];
      if (errorMessages.length > 0 && errorMessages[0].length > 0) {
        return errorMessages[0][0]; // First error message from first field
      }
    }
    // Fallback to generic message
    return error?.message || "An error occurred";
  };

  const handleAddressChange = (field: string, value: string | boolean) => {
    if (editingAddress) {
      setEditingAddress({ ...editingAddress, [field]: value });
    } else {
      setNewAddress({ ...newAddress, [field]: value });
    }
  };

  const getCountryInfo = (countryCode: string): Country | undefined => {
    return getCountryByCode(countryCode);
  };

  const getAvailableStates = (countryCode: string): Subdivision[] => {
    return getSubdivisionsByCountry(countryCode);
  };

  return (
    <div className="space-y-8">
      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        
        {isLoadingPayments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payment methods...</span>
          </div>
        ) : (
          <>
            {/* Existing Cards */}
            <div className="space-y-3">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment methods added yet
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-8 sm:h-10 w-12 sm:w-14 bg-secondary rounded flex items-center justify-center">
                        <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <span className="font-medium">{getCardIcon(method.card_brand)}</span>
                          <span className="text-muted-foreground">•••• {method.card_last_four}</span>
                          {method.is_default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          {method.is_verified ? (
                            <Badge variant="secondary" className="text-xs bg-accent">Verified</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Unverified</Badge>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Expires {method.expiration_date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                          disabled={setDefaultPaymentMethod.isPending}
                        >
                          {setDefaultPaymentMethod.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Set Default"
                          )}
                        </Button>
                      )}

                    {!method.is_verified && (
                        <Button variant="outline" size="sm"
                        onClick={() => handleVerifyCard(method.id)}
                        >
                          Verify
                        </Button>
                      )}

                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCard(method.id)}
                        disabled={deletePaymentMethod.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletePaymentMethod.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

        {/* Add New Card */}
        <Collapsible open={showAddCard} onOpenChange={setShowAddCard}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="border border-border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input 
                  id="cardHolder" 
                  placeholder="John Doe"
                  value={newCard.card_holder_name}
                  onChange={(e) => setNewCard({ ...newCard, card_holder_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="4242424242424242"
                  value={newCard.card_number}
                  onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="12/30"
                    value={newCard.expiration_date}
                    onChange={(e) => setNewCard({ ...newCard, expiration_date: e.target.value })}
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
              <div className="border-t border-border pt-4 -mx-4 px-4">
                <div className="bg-muted/40 rounded-lg p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Verification method</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Choose how your card is securely verified
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['paystack', 'stripe'] as const).map((p) => {
                      const isSelected = newCard.provider === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewCard({ ...newCard, provider: p })}
                          className={cn(
                            "rounded-lg border p-3 text-left transition-all duration-150 relative bg-background",
                            isSelected
                              ? "border-[#748943] ring-1 ring-[#748943]"
                              : "border-border hover:border-[#748943]/40"
                          )}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#748943] flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </span>
                          )}
                          <p className="text-sm font-medium capitalize pr-5">{p}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p === 'paystack' ? 'African cards' : 'Global support'}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            3D Secure
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newCard.is_default}
                  onChange={(e) => setNewCard({ ...newCard, is_default: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isDefault" className="text-sm">Set as default payment method</Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAddCard}
                  disabled={addPaymentMethod.isPending}
                >
                  {addPaymentMethod.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Payment Method"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
          </>
        )}
      </div>

      {/* Billing Addresses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Addresses</h3>

        {isLoadingAddresses ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading billing addresses...</span>
          </div>
        ) : (
          <>
            {/* Existing Addresses */}
            <div className="space-y-3">
              {billingAddresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No billing addresses added yet
                </div>
              ) : (
                billingAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-8 sm:h-10 w-12 sm:w-14 bg-secondary rounded flex items-center justify-center">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm sm:text-base mb-1">
                          <span className="font-medium">{address.name}</span>
                          {address.is_default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          <div>{address.address}</div>
                          <div>{address.city}, {address.state && `${address.state}, `}{getCountryInfo(address.country)?.name || address.country}</div>
                          <div>{getCountryInfo(address.country)?.zipLabel || "Postal Code"}: {address.zip_code}</div>
                          {address.phone_number && <div>Phone: {address.phone_number}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingAddress(address)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Billing Address</DialogTitle>
                            <DialogDescription>
                              Update your billing address information.
                            </DialogDescription>
                          </DialogHeader>
                          {editingAddress && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editName">Full Name</Label>
                                  <Input
                                    id="editName"
                                    value={editingAddress.name}
                                    onChange={(e) => handleAddressChange("name", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editPhone">Phone Number</Label>
                                  <Input
                                    id="editPhone"
                                    value={editingAddress.phone_number}
                                    onChange={(e) => handleAddressChange("phone_number", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editCountry">Country</Label>
                                <Select
                                  value={editingAddress.country}
                                  onValueChange={(value) => handleAddressChange("country", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background">
                                    {countries.map(country => (
                                      <SelectItem key={country.code} value={country.code}>
                                        {country.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="editAddress">Street Address</Label>
                                <Input
                                  id="editAddress"
                                  value={editingAddress.address}
                                  onChange={(e) => handleAddressChange("address", e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editCity">City</Label>
                                  <Input
                                    id="editCity"
                                    value={editingAddress.city}
                                    onChange={(e) => handleAddressChange("city", e.target.value)}
                                  />
                                </div>
                                {getCountryInfo(editingAddress.country)?.hasStates && (
                                  <div className="space-y-2">
                                    <Label htmlFor="editState">State/Province</Label>
                                    <Select
                                      value={editingAddress.state || ""}
                                      onValueChange={(value) => handleAddressChange("state", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select state/province" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-background max-h-60">
                                        {getAvailableStates(editingAddress.country).map((state: Subdivision) => (
                                          <SelectItem key={state.code} value={state.code}>
                                            {state.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <Label htmlFor="editZip">
                                    {getCountryInfo(editingAddress.country)?.zipLabel || "Postal Code"}
                                  </Label>
                                  <Input
                                    id="editZip"
                                    value={editingAddress.zip_code}
                                    onChange={(e) => handleAddressChange("zip_code", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="editIsDefault"
                                  checked={editingAddress.is_default}
                                  onChange={(e) => handleAddressChange("is_default", e.target.checked)}
                                  className="rounded"
                                />
                                <Label htmlFor="editIsDefault" className="text-sm">Set as default billing address</Label>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  onClick={handleUpdateAddress}
                                  disabled={updateBillingAddress.isPending}
                                >
                                  {updateBillingAddress.isPending ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Updating...
                                    </>
                                  ) : (
                                    "Update Address"
                                  )}
                                </Button>
                                <Button variant="outline" onClick={() => setEditingAddress(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={deleteBillingAddress.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        {deleteBillingAddress.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Address */}
            <Collapsible open={showAddAddress} onOpenChange={setShowAddAddress}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Billing Address
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newName">Full Name</Label>
                      <Input
                        id="newName"
                        placeholder="John Doe"
                        value={newAddress.name}
                        onChange={(e) => handleAddressChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPhone">Phone Number</Label>
                      <Input
                        id="newPhone"
                        placeholder="+1 555 123 4567"
                        value={newAddress.phone_number}
                        onChange={(e) => handleAddressChange("phone_number", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newCountry">Country</Label>
                    <Select
                      value={newAddress.country}
                      onValueChange={(value) => handleAddressChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newAddress">Street Address</Label>
                    <Input
                      id="newAddress"
                      placeholder="123 Main Street"
                      value={newAddress.address}
                      onChange={(e) => handleAddressChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newCity">City</Label>
                      <Input
                        id="newCity"
                        placeholder="New York"
                        value={newAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                      />
                    </div>
                    {getCountryInfo(newAddress.country)?.hasStates && (
                      <div className="space-y-2">
                        <Label htmlFor="newState">State/Province</Label>
                        <Select
                          value={newAddress.state}
                          onValueChange={(value) => handleAddressChange("state", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state/province" />
                          </SelectTrigger>
                          <SelectContent className="bg-background max-h-60">
                            {getAvailableStates(newAddress.country).map((state: Subdivision) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="newZip">
                        {getCountryInfo(newAddress.country)?.zipLabel || "Postal Code"}
                      </Label>
                      <Input
                        id="newZip"
                        placeholder="10001"
                        value={newAddress.zip_code}
                        onChange={(e) => handleAddressChange("zip_code", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="newIsDefault"
                      checked={newAddress.is_default}
                      onChange={(e) => handleAddressChange("is_default", e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="newIsDefault" className="text-sm">Set as default billing address</Label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleAddAddress}
                      disabled={addBillingAddress.isPending}
                    >
                      {addBillingAddress.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        "Add Billing Address"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentAddress;
