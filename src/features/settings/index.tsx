'use client';

import { useState, useCallback } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Gavel, Bell, CreditCard, Megaphone } from "lucide-react";
import { toast } from "sonner";
import NotificationSection from "./components/NotificationSection";

interface NotificationSettings {
    [key: string]: boolean;
}

const Settings = () => {
    const [settings, setSettings] = useState<NotificationSettings>({
        // Bidding Activity
        outbid: true,
        winAuction: true,
        auctionEndingSoon: true,
        watchedPriceChange: false,
        watchedClosingSoon: true,
        // Auction & Event Reminders
        registeredReminders: true,
        auctionsStartingSoon: true,
        dailySummary: false,
        // Account & Transactions
        paymentStatus: true,
        securityUpdates: true,
        policyUpdates: true,
        // Marketing & Updates
        productUpdates: false,
        newRecommendations: true,
        promotions: false,
    });

    const handleToggle = useCallback((id: string, enabled: boolean) => {
        setSettings((prev) => ({ ...prev, [id]: enabled }));
        toast("Setting updated", {
            description: `Notification ${enabled ? "enabled" : "disabled"} successfully.`,
        });
    }, []);

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
                    onClick={() => {
                        toast("Settings saved", {
                            description: "Your notification preferences have been saved successfully.",
                        });
                    }}
                    className="w-full sm:w-fit"
                >
                    Save Changes
                </Button>
            </div>

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
