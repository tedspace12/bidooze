import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Nigeria", "South Africa", "India", "Japan"
];

const timezones = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00 (PST)",
  "UTC-07:00 (MST)", "UTC-06:00 (CST)", "UTC-05:00 (EST)", "UTC-04:00",
  "UTC-03:00", "UTC-02:00", "UTC-01:00", "UTC+00:00 (GMT)", "UTC+01:00 (WAT)",
  "UTC+02:00", "UTC+03:00", "UTC+04:00", "UTC+05:00", "UTC+05:30 (IST)",
  "UTC+06:00", "UTC+07:00", "UTC+08:00", "UTC+09:00", "UTC+10:00", "UTC+11:00", "UTC+12:00"
];

const UserInformation = () => {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    country: "United States",
    phone: "+1 555 123 4567",
    aboutMe: "",
    timezone: "UTC-05:00 (EST)",
    companyName: "",
    companyUrl: "",
  });

  const [emailVerified] = useState(true);
  const [cardVerified] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving user information:", formData);
  };

  return (
    <div className="space-y-8">
      {/* User Information Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email"
            value={formData.email}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">Tell Us More</Label>
          <Textarea 
            id="aboutMe" 
            placeholder="Tell us about yourself, your interests, and what you're looking for..."
            value={formData.aboutMe}
            onChange={(e) => handleChange("aboutMe", e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select value={formData.timezone} onValueChange={(value) => handleChange("timezone", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-background max-h-60">
                {timezones.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              placeholder="Your company name"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyUrl">Company URL</Label>
          <Input 
            id="companyUrl" 
            type="url"
            placeholder="https://yourcompany.com"
            value={formData.companyUrl}
            onChange={(e) => handleChange("companyUrl", e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full md:w-auto">
          Save Changes
        </Button>
      </div>

      {/* Verification Status */}
      <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-semibold">Verification Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm sm:text-base">Email Verification</span>
            {emailVerified ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-[10px] sm:text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] sm:text-xs">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm sm:text-base">Credit Card Verification</span>
            {cardVerified ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-[10px] sm:text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] sm:text-xs">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border border-border rounded-lg p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-semibold">Security</h3>
        <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Reset Password</Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your new password below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="w-full" onClick={() => setResetPasswordOpen(false)}>
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserInformation;
