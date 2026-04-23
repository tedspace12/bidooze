'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Gavel, Store, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useContact } from "./hooks/useContact";
import type { ContactReason } from "./types";

const sellerPanelUrl = process.env.NEXT_PUBLIC_SELLER_PANEL_URL?.trim() || "";

const Contact = () => {
    const router = useRouter();

    const { useSubmitContact } = useContact();
    const { mutate: submitContact, isPending } = useSubmitContact();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        reason: "" as ContactReason | "",
        message: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error("Missing information", {
                description: "Please enter your first and last name.",
            });
            return;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Invalid email", {
                description: "Please enter a valid email address.",
            });
            return;
        }

        if (!formData.reason) {
            toast.error("Missing reason", {
                description: "Please select a reason for contacting us.",
            });
            return;
        }

        if (!formData.message.trim()) {
            toast.error("Missing message", {
                description: "Please enter your message.",
            });
            return;
        }

        submitContact(
            {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone || undefined,
                reason: formData.reason,
                message: formData.message,
            },
            {
                onSuccess: () => {
                    toast("Message sent!", {
                        description: "Thank you for reaching out. We'll get back to you shortly.",
                    });
                    setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        reason: "",
                        message: "",
                    });
                },
                onError: (error: unknown) => {
                    const err = error as { message?: string };
                    toast.error("Failed to send message", {
                        description: err?.message || "Something went wrong. Please try again.",
                    });
                },
            }
        );
    };

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
                        <BreadcrumbPage>Contact Us</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                    Have questions, feedback, or partnership inquiries? We&apos;re here to help.
                    Reach out to our team and we&apos;ll get back to you as soon as possible.
                </p>
            </div>

            {/* CTA Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                {/* Start Bidding CTA */}
                <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 sm:p-3 rounded-full bg-primary/20">
                                <Gavel className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Start Bidding</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                            Join thousands of bidders discovering unique items every day.
                            Create your free account and start placing bids on auctions you love.
                        </p>
                        <Button
                            onClick={() => router.push("/auth/signup")}
                            className="group"
                        >
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Sell With Bidooze CTA */}
                <Card className="bg-linear-to-br from-accent/20 to-accent/5 border-accent/30 overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 sm:p-3 rounded-full bg-accent/30">
                                <Store className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Sell With Bidooze</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                            Are you an auctioneer? List your auctions on Bidooze and reach
                            millions of potential buyers. Create auctions and add lots easily.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={() => {
                            if (sellerPanelUrl) window.location.assign(sellerPanelUrl);
                            }}
                            disabled={!sellerPanelUrl}
                            className="group"
                        >
                            Start Selling
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Form */}
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Send className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Send Us a Message</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Contact *</Label>
                            <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general_inquiry">General inquiry</SelectItem>
                                    <SelectItem value="auction_support">Auction support</SelectItem>
                                    <SelectItem value="bidding_issue">Bidding issue</SelectItem>
                                    <SelectItem value="account_help">Account help</SelectItem>
                                    <SelectItem value="partnership_selling">Partnership / Selling on Bidooze</SelectItem>
                                    <SelectItem value="feedback">Feedback</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                placeholder="Tell us how we can help..."
                                rows={5}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
};

export default Contact;
