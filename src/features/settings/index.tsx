'use client';

import { useState, useCallback, useEffect, useMemo } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Gavel, Bell, CreditCard, Megaphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import NotificationSection from "./components/NotificationSection";
import { useSettings } from "./hooks/useSettings";
import {
    defaultBuyerNotificationSettings,
    type BuyerNotificationSettings,
} from "./types";

const Settings = () => {
    const { useBuyerSettings, updateBuyerSettings } = useSettings();
    const settingsQuery = useBuyerSettings();
    const [settings, setSettings] = useState<BuyerNotificationSettings>(defaultBuyerNotificationSettings);

    useEffect(() => {
        if (settingsQuery.data?.data) {
            setSettings(settingsQuery.data.data);
        }
    }, [settingsQuery.data]);

    const isDirty = useMemo(() => {
        const source = settingsQuery.data?.data ?? defaultBuyerNotificationSettings;
        return Object.keys(defaultBuyerNotificationSettings).some((key) => {
            const typedKey = key as keyof BuyerNotificationSettings;
            return settings[typedKey] !== source[typedKey];
        });
    }, [settings, settingsQuery.data]);

    const handleToggle = useCallback((id: string, enabled: boolean) => {
        setSettings((prev) => ({ ...prev, [id]: enabled } as BuyerNotificationSettings));
    }, []);

    const handleSave = async () => {
        try {
            const response = await updateBuyerSettings.mutateAsync(settings);
            if (response?.data) {
                setSettings(response.data);
            }
            settingsQuery.refetch();
            toast("Settings saved", {
                description: "Your notification preferences have been saved successfully.",
            });
        } catch (error: any) {
            toast.error(error?.message || "Failed to save settings");
        }
    };

    const biddingActivitySettings = [
        {
            id: "outbid",
            label: "Outbid notifications",
            description: "Get notified immediately when someone outbids you on an item",
            enabled: settings.outbid,
        },
        {
            id: "winAuction",
            label: "Auction won",
            description: "Receive a notification when you win an auction",
            enabled: settings.winAuction,
        },
        {
            id: "auctionEndingSoon",
            label: "Auction ending soon",
            description: "Get alerts when auctions you're bidding on are about to close",
            enabled: settings.auctionEndingSoon,
        },
        {
            id: "watchedPriceChange",
            label: "Watched item price changes",
            description: "Be notified when the price changes on items in your watchlist",
            enabled: settings.watchedPriceChange,
        },
        {
            id: "watchedClosingSoon",
            label: "Watched auction closing",
            description: "Receive alerts when watched auctions are closing soon",
            enabled: settings.watchedClosingSoon,
        },
    ];

    const auctionRemindersSettings = [
        {
            id: "registeredReminders",
            label: "Registered auction reminders",
            description: "Get reminders for upcoming auctions you've registered for",
            enabled: settings.registeredReminders,
        },
        {
            id: "auctionsStartingSoon",
            label: "Auctions starting soon",
            description: "Receive notifications when auctions you're interested in are about to start",
            enabled: settings.auctionsStartingSoon,
        },
        {
            id: "dailySummary",
            label: "Daily auction summary",
            description: "Get a daily digest of all active auctions you're involved in",
            enabled: settings.dailySummary,
        },
    ];

    const accountTransactionsSettings = [
        {
            id: "paymentStatus",
            label: "Payment notifications",
            description: "Get notified when a payment is successful or fails",
            enabled: settings.paymentStatus,
        },
        {
            id: "securityUpdates",
            label: "Account security alerts",
            description: "Receive notifications about account activity and security updates",
            enabled: settings.securityUpdates,
        },
        {
            id: "policyUpdates",
            label: "Policy and terms updates",
            description: "Stay informed about important policy or terms changes",
            enabled: settings.policyUpdates,
        },
    ];

    const marketingSettings = [
        {
            id: "productUpdates",
            label: "Product updates",
            description: "Receive Bidooze product updates and new feature announcements",
            enabled: settings.productUpdates,
        },
        {
            id: "newRecommendations",
            label: "Auction recommendations",
            description: "Get personalized new auction recommendations based on your interests",
            enabled: settings.newRecommendations,
        },
        {
            id: "promotions",
            label: "Promotions and featured auctions",
            description: "Receive promotional offers and featured auction highlights",
            enabled: settings.promotions,
        },
    ];

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header with Save Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your notification preferences and communication settings.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    className="w-full sm:w-fit"
                    disabled={updateBuyerSettings.isPending || settingsQuery.isLoading || !isDirty}
                >
                    {updateBuyerSettings.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>

            {settingsQuery.isLoading && (
                <div className="max-w-3xl mb-6 rounded-lg border border-border p-4 text-sm text-muted-foreground">
                    Loading your notification settings...
                </div>
            )}
            {settingsQuery.isError && (
                <div className="max-w-3xl mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    Couldn&apos;t load settings. You can still adjust defaults and try saving again.
                </div>
            )}

            {/* Notification Sections */}
            <div className="max-w-3xl space-y-6">
                <NotificationSection
                    title="Bidding Activity"
                    icon={<Gavel className="h-5 w-5" />}
                    settings={biddingActivitySettings}
                    onToggle={handleToggle}
                />

                <NotificationSection
                    title="Auction & Event Reminders"
                    icon={<Bell className="h-5 w-5" />}
                    settings={auctionRemindersSettings}
                    onToggle={handleToggle}
                />

                <NotificationSection
                    title="Account & Transactions"
                    icon={<CreditCard className="h-5 w-5" />}
                    settings={accountTransactionsSettings}
                    onToggle={handleToggle}
                />

                <NotificationSection
                    title="Marketing & Updates"
                    icon={<Megaphone className="h-5 w-5" />}
                    settings={marketingSettings}
                    onToggle={handleToggle}
                />
            </div>
        </main>
    );
};

export default Settings;
