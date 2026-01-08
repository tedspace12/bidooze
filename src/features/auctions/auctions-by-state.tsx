'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { USMap } from "./components/maps/us-map";
import StateList from "./components/StateList";
import { canadaMap, unitedStatesMap } from "./constants/data";
import { CanadaMap } from "./components/maps/canada-map";

export const AuctionsByState = () => {
    const [activeTab, setActiveTab] = useState("usa");

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
                        <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Auctions by State</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Find Live & Online Auctions Near You</h1>
            <p className="text-muted-foreground w-[70%]">Bidooze&apos;s interactive “Auctions Near Me” map helps you discover upcoming live and online auctions near you. Bidooze is a leading online auction platform providing access to hundreds of local and international auctions. Browse our full range of auction catalogs and sign up to place live or absentee bids anytime, from anywhere.</p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
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

                <TabsContent value="usa" className="mt-6">
                    <USMap />
                    <StateList states={unitedStatesMap} />
                </TabsContent>

                <TabsContent value="canada" className="mt-6">
                    <CanadaMap />
                    <StateList states={canadaMap} />
                </TabsContent>
            </Tabs>
        </main>
    )
}