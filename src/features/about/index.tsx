'use client';

import { Button } from "@/components/ui/button";
import {
    Shield,
    Globe,
    Users,
    Zap,
    Award,
    Clock,
    TrendingUp,
    HeartHandshake
} from "lucide-react";
import Link from "next/link";

const stats = [
    { value: "50K+", label: "Active Bidders" },
    { value: "10K+", label: "Auctions Completed" },
    { value: "500+", label: "Verified Auctioneers" },
    { value: "$25M+", label: "Items Sold" },
];

const values = [
    {
        icon: Shield,
        title: "Trust & Security",
        description: "Every transaction is protected with bank-level security. Your bids and payments are safe with us."
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connect with buyers and sellers from around the world. Discover unique items from every corner of the globe."
    },
    {
        icon: Zap,
        title: "Real-Time Bidding",
        description: "Experience the thrill of live auctions with instant updates and seamless bidding technology."
    },
    {
        icon: HeartHandshake,
        title: "Fair & Transparent",
        description: "Clear pricing, no hidden fees. We believe in honest auctions where everyone has an equal opportunity."
    },
];

const features = [
    {
        icon: Clock,
        title: "24/7 Auctions",
        description: "Bid anytime, anywhere. Our platform never sleeps."
    },
    {
        icon: Users,
        title: "Verified Sellers",
        description: "Every auctioneer is vetted for authenticity and reliability."
    },
    {
        icon: TrendingUp,
        title: "Price Tracking",
        description: "Follow market trends and make informed bidding decisions."
    },
    {
        icon: Award,
        title: "Quality Guaranteed",
        description: "Detailed item descriptions and condition reports on every lot."
    },
];

const About = () => {
    return (
        <main>
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        About Bidooze
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Bidooze is a modern auction platform connecting buyers and sellers worldwide.
                        We make bidding simple, transparent, and accessible to everyone.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-primary/5 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                    <div className="space-y-4">
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full mb-2">
                            Our Mission
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">
                            Democratizing Access to Auctions
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                            To create the most trusted and user-friendly auction marketplace,
                            empowering collectors, enthusiasts, and sellers to discover and trade
                            unique items with confidence. We break down barriers and make the
                            auction experience accessible to everyone.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full mb-2">
                            Our Vision
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">
                            The Future of Online Auctions
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                            A world where everyone has access to exceptional auctions,
                            from rare collectibles to everyday treasures, all in one
                            seamless digital experience. We envision a global marketplace
                            where value finds its true worth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-muted/50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                            The principles that guide everything we do at Bidooze.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="bg-background rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Why Choose Bidooze?
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                        We&apos;re building the best auction experience, one feature at a time.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="text-center p-4 sm:p-6 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Our Story
                        </h2>
                        <div className="space-y-4 text-muted-foreground text-sm sm:text-lg leading-relaxed">
                            <p>
                                Bidooze was founded with a simple belief: auctions should be accessible,
                                exciting, and fair for everyone. What started as a passion project has
                                grown into a thriving marketplace connecting thousands of buyers and
                                sellers across the globe.
                            </p>
                            <p>
                                Today, we&apos;re proud to host auctions spanning fine art, vintage collectibles,
                                rare jewelry, classic automobiles, and so much more. Our platform combines
                                cutting-edge technology with a deep respect for the timeless tradition
                                of the auction house.
                            </p>
                            <p>
                                Every day, we work to make Bidooze better—faster, more secure, and more
                                enjoyable for our growing community of auction enthusiasts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center bg-linear-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-3xl p-8 md:p-16 border border-primary/20">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Ready to Start Bidding?
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of bidders and discover unique items today.
                        Your next treasure is just a bid away.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-base px-8">
                            <Link href="/auth/signup">Create Free Account</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-base px-8">
                            <Link href="/auctions">Browse Auctions</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
