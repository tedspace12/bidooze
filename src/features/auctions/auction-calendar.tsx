'use client';

import { useState, useMemo } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DailySchedule from "./components/calendar/DailySchedule";
import CalendarGrid from "./components/calendar/CalendarGrid";
import CalendarFilters from "./components/calendar/CalendarFilters";
import CalendarHeader from "./components/calendar/CalendarHeader";
import { generateMockAuctions } from "./data/auctionCalendarData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

const AuctionCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAuctioneers, setSelectedAuctioneers] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [mobileView, setMobileView] = useState<"calendar" | "schedule">("calendar");
    const isMobile = useIsMobile();

    const fullYear = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const auctionsMap = useMemo(() => {
        return generateMockAuctions(fullYear, month);
    }, [fullYear, month]);

    const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    const selectedDayAuctions = auctionsMap.get(selectedDateKey) || [];

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        // On mobile, switch to schedule view after selecting a date
        if (isMobile) {
            setMobileView("schedule");
        };
    }

    return (
        <main>
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-4 md:mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Auction Calendar</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Page Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
                        Auction Calendar
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                        Daily and monthly calendar of online auctions by date — easily identify and track upcoming auctions.
                    </p>
                </div>

                {/* Mobile View - Tabs for Calendar/Schedule */}
                {isMobile ? (
                    <div className="space-y-4">
                        {/* Mobile Tab Switcher */}
                        <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as "calendar" | "schedule")}>
                            <TabsList className="w-full">
                                <TabsTrigger value="calendar" className="flex-1 gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Calendar
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="flex-1 gap-2">
                                    <List className="h-4 w-4" />
                                    Schedule
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="calendar" className="mt-4">
                                <div className="bg-card border border-border rounded-xl p-4">
                                    <CalendarHeader
                                        currentDate={currentDate}
                                        onPreviousMonth={handlePreviousMonth}
                                        onNextMonth={handleNextMonth}
                                    />
                                    <CalendarFilters
                                        selectedAuctioneers={selectedAuctioneers}
                                        selectedTypes={selectedTypes}
                                        onAuctioneersChange={setSelectedAuctioneers}
                                        onTypesChange={setSelectedTypes}
                                    />
                                    <CalendarGrid
                                        currentDate={currentDate}
                                        selectedDate={selectedDate}
                                        auctionsMap={auctionsMap}
                                        onDateSelect={handleDateSelect}
                                    />
                                </div>

                                {/* Legend */}
                                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                                        <span>Live auctions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                                        <span>All closed</span>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="schedule" className="mt-4">
                                <DailySchedule
                                    selectedDate={selectedDate}
                                    auctions={selectedDayAuctions}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    /* Desktop View - Side by Side */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <CalendarHeader
                                    currentDate={currentDate}
                                    onPreviousMonth={handlePreviousMonth}
                                    onNextMonth={handleNextMonth}
                                />
                                <CalendarFilters
                                    selectedAuctioneers={selectedAuctioneers}
                                    selectedTypes={selectedTypes}
                                    onAuctioneersChange={setSelectedAuctioneers}
                                    onTypesChange={setSelectedTypes}
                                />
                                <CalendarGrid
                                    currentDate={currentDate}
                                    selectedDate={selectedDate}
                                    auctionsMap={auctionsMap}
                                    onDateSelect={handleDateSelect}
                                />
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-primary" />
                                    <span>Live auctions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-muted" />
                                    <span>All closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Daily Schedule Panel */}
                        <div className="lg:col-span-1">
                            <DailySchedule
                                selectedDate={selectedDate}
                                auctions={selectedDayAuctions}
                            />
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
};

export default AuctionCalendar;
