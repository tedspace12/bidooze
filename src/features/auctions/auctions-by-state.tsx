'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { USMap } from "./components/maps/us-map";
import StateList from "./components/StateList";
import { canadaMap, unitedStatesMap } from "./constants/data";
import { CanadaMap } from "./components/maps/canada-map";
import { useAuctionStatesSummary } from "./hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const toPrefixedRegionCode = (country: "US" | "CA", code: string) => {
    const trimmed = String(code ?? "").trim().toUpperCase();
    if (!trimmed) return `${country}-`;
    if (trimmed.startsWith(`${country}-`)) return trimmed;
    if (trimmed.includes("-")) return `${country}-${trimmed.split("-").pop()}`;
    return `${country}-${trimmed}`;
};

export const AuctionsByState = () => {
    const [activeTab, setActiveTab] = useState("usa");
    const {
        data: usSummary,
        isLoading: isUSLoading,
        isError: isUSError,
    } = useAuctionStatesSummary({ country: "US" });
    const {
        data: caSummary,
        isLoading: isCALoading,
        isError: isCAError,
    } = useAuctionStatesSummary({ country: "CA" });

    const usCountsByCode = useMemo(() => {
        const out: Record<string, number> = {};
        usSummary?.states?.forEach((state) => {
            out[toPrefixedRegionCode("US", state.code)] = state.auction_count;
        });
        return out;
    }, [usSummary]);

    const caCountsByCode = useMemo(() => {
        const out: Record<string, number> = {};
        caSummary?.states?.forEach((state) => {
            out[toPrefixedRegionCode("CA", state.code)] = state.auction_count;
        });
        return out;
    }, [caSummary]);

    return (
        <main className="container mx-auto px-4 py-6 md:py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Auctions by State</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Find Live & Online Auctions Near You</h1>
            <p className="text-sm sm:text-base text-muted-foreground w-full md:w-[70%]">Bidooze&apos;s interactive “Auctions Near Me” map helps you discover upcoming live and online auctions near you. Bidooze is a leading online auction platform providing access to hundreds of local and international auctions. Browse our full range of auction catalogs and sign up to place live or absentee bids anytime, from anywhere.</p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                        value="usa"
                        className="rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 w-fit flex-none"
                    >
                        United States
                    </TabsTrigger>
                    <TabsTrigger
                        value="canada"
                        className="rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 w-fit flex-none"
                    >
                        Canada
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="usa" className="mt-2 xl:mt-6">
                {isUSLoading ? (
                    <div className="space-y-6 mt-6">
                        {/* Map skeleton */}
                        <Skeleton className="w-full h-[400px] xl:h-[800px] rounded-lg" />

                        {/* State list skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 rounded-md" />
                        ))}
                        </div>
                    </div>
                    ) : isUSError ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                            <div className="text-lg font-semibold">
                            Failed to load auction data
                            </div>
                        
                            <p className="text-sm text-muted-foreground max-w-md">
                            We couldn't fetch auction counts for the United States. 
                            Please check your connection or try again.
                            </p>
                        
                            <Button onClick={() => window.location.reload()}>
                            Retry
                            </Button>
                        </div>
                    ) : (
                    <>
                        <USMap countsByCode={usCountsByCode} />
                        <StateList states={unitedStatesMap} countsByCode={usCountsByCode} />
                    </>
                )}
                </TabsContent>

                <TabsContent value="canada" className="mt-2 xl:mt-6">
                    {isCALoading ? (
                        <div className="space-y-6 mt-6">
                            <Skeleton className="w-full h-[400px] xl:h-[800px] rounded-lg" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <Skeleton key={i} className="h-10 rounded-md" />
                                ))}
                            </div>
                        </div>
                    ) : isCAError ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                            <div className="text-lg font-semibold">
                                Failed to load Canada auctions counts data
                                </div>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    We couldn't fetch auctions counts for the Canada. 
                                    Please check your connection or try again.
                                </p>
                                <Button onClick={() => window.location.reload()}>
                                    Retry
                                </Button>
                        </div>
                    ) : (
                        <>
                            <CanadaMap countsByCode={caCountsByCode} />
                            <StateList states={canadaMap} countsByCode={caCountsByCode} />
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    )
}