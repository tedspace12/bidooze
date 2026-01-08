'use client';

import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { User, CreditCard } from "lucide-react";
import UserInformation from "./components/UserInformation";
import PaymentAddress from "./components/PaymentAddress";

const Account = () => {
    const [activeTab, setActiveTab] = useState<"user" | "payment">("user");

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
                        <BreadcrumbPage>Account</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your personal information, payment methods, and account preferences.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-border">
                <button
                    onClick={() => setActiveTab("user")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "user"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <User className="h-4 w-4" />
                    User Information
                </button>
                <button
                    onClick={() => setActiveTab("payment")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "payment"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    <CreditCard className="h-4 w-4" />
                    Payment & Address
                </button>
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl">
                {activeTab === "user" && <UserInformation />}
                {activeTab === "payment" && <PaymentAddress />}
            </div>
        </main>
    );
};

export default Account;
