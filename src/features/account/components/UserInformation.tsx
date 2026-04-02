import { useState, useEffect } from "react";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

const countries = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NG", label: "Nigeria" },
  { value: "ZA", label: "South Africa" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" }
];

const timezones = [
  { value: "Etc/GMT+12", label: "Etc/GMT+12 - UTC-12:00" },
  { value: "Etc/GMT+11", label: "Etc/GMT+11 - UTC-11:00" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu - UTC-10:00" },
  { value: "America/Anchorage", label: "America/Anchorage - UTC-09:00" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles - UTC-08:00 (PST)" },
  { value: "America/Denver", label: "America/Denver - UTC-07:00 (MST)" },
  { value: "America/Chicago", label: "America/Chicago - UTC-06:00 (CST)" },
  { value: "America/New_York", label: "America/New_York - UTC-05:00 (EST)" },
  { value: "America/Halifax", label: "America/Halifax - UTC-04:00" },
  { value: "America/St_Johns", label: "America/St_Johns - UTC-03:30" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo - UTC-03:00" },
  { value: "Atlantic/Azores", label: "Atlantic/Azores - UTC-01:00" },
  { value: "Europe/London", label: "Europe/London - UTC+00:00 (GMT)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam - UTC+01:00" },
  { value: "Africa/Lagos", label: "Africa/Lagos - UTC+01:00" },
  { value: "Europe/Kiev", label: "Europe/Kiev - UTC+02:00" },
  { value: "Europe/Moscow", label: "Europe/Moscow - UTC+03:00" },
  { value: "Asia/Dubai", label: "Asia/Dubai - UTC+04:00" },
  { value: "Asia/Karachi", label: "Asia/Karachi - UTC+05:00" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata - UTC+05:30 (IST)" },
  { value: "Asia/Dhaka", label: "Asia/Dhaka - UTC+06:00" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok - UTC+07:00" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai - UTC+08:00" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo - UTC+09:00" },
  { value: "Australia/Sydney", label: "Australia/Sydney - UTC+10:00" },
  { value: "Pacific/Guam", label: "Pacific/Guam - UTC+10:00" },
  { value: "Pacific/Fiji", label: "Pacific/Fiji - UTC+12:00" }
];

const timezoneMap: Record<string, string> = {
  "UTC-12:00": "Etc/GMT+12",
  "UTC-11:00": "Etc/GMT+11",
  "UTC-10:00": "Pacific/Honolulu",
  "UTC-09:00": "America/Anchorage",
  "UTC-08:00": "America/Los_Angeles",
  "UTC-07:00": "America/Denver",
  "UTC-06:00": "America/Chicago",
  "UTC-05:00": "America/New_York",
  "UTC-04:00": "America/Halifax",
  "UTC-03:30": "America/St_Johns",
  "UTC-03:00": "America/Sao_Paulo",
  "UTC-01:00": "Atlantic/Azores",
  "UTC+00:00": "Europe/London",
  "UTC+01:00": "Africa/Lagos",
  "UTC+02:00": "Europe/Kiev",
  "UTC+03:00": "Europe/Moscow",
  "UTC+04:00": "Asia/Dubai",
  "UTC+05:00": "Asia/Karachi",
  "UTC+05:30": "Asia/Kolkata",
  "UTC+06:00": "Asia/Dhaka",
  "UTC+07:00": "Asia/Bangkok",
  "UTC+08:00": "Asia/Shanghai",
  "UTC+09:00": "Asia/Tokyo",
  "UTC+10:00": "Australia/Sydney",
  "UTC+12:00": "Pacific/Fiji",
  "Africa/Lagos": "Africa/Lagos",
  "America/New_York": "America/New_York",
  "America/Chicago": "America/Chicago",
  "America/Denver": "America/Denver",
  "America/Los_Angeles": "America/Los_Angeles"
};

const normalizeTimezone = (timezone: string) => {
  if (!timezone) return "";
  if (timezones.some((item) => item.value === timezone)) return timezone;
  if (timezoneMap[timezone]) return timezoneMap[timezone];
  const normalized = timezones.find((item) => item.label.toLowerCase().includes(timezone.toLowerCase()));
  return normalized ? normalized.value : "";
};

const UserInformation = () => {
  const { getBuyerProfile, updateBuyerProfile, updateBuyerPassword } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    phone_number: "",
    bio: "",
    timezone: "",
    company_name: "",
    company_url: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [cardVerified] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getBuyerProfile.mutateAsync();
        if (response?.user) {
          const rawTimezone = response.user.timezone || response.user.time_zone || "";
          setFormData({
            first_name: response.user.first_name || "",
            last_name: response.user.last_name || "",
            email: response.user.email || "",
            country: response.user.country || "",
            phone_number: response.user.phone_number || "",
            bio: response.user.bio || "",
            timezone: normalizeTimezone(rawTimezone),
            company_name: response.user.company_name || "",
            company_url: response.user.company_url || "",
          });
          setEmailVerified(Boolean(response.user.email_verified));
        }
      } catch (error: any) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      await updateBuyerPassword.mutateAsync(passwordData);
      toast.success("Password updated successfully");
      setResetPasswordOpen(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update password");
    }
  };

  const handleSave = async () => {
    try {
      await updateBuyerProfile.mutateAsync(formData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      {/* User Information Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
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
                  <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">Tell Us More</Label>
          <Textarea
            id="aboutMe"
            placeholder="Tell us about yourself, your interests, and what you're looking for..."
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
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
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Your company name"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyUrl">Company URL</Label>
          <Input
            id="companyUrl"
            type="url"
            placeholder="https://yourcompany.com"
            value={formData.company_url}
            onChange={(e) => handleChange("company_url", e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full md:w-auto"
          disabled={updateBuyerProfile.isPending}
        >
          {updateBuyerProfile.isPending ? "Saving..." : "Save Changes"}
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
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => handlePasswordChange("new_password_confirmation", e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handlePasswordUpdate}
                disabled={updateBuyerPassword.isPending}
              >
                {updateBuyerPassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserInformation;
