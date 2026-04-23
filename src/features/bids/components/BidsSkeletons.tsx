import { Skeleton } from "@/components/ui/skeleton";

export const BidsSummarySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                <div>
                    <Skeleton className="h-4 w-20" />
                </div>
                <div>
                    <Skeleton className="h-8 w-12 mb-1" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        ))}
    </div>
);

export const BidsListSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-3 md:p-4 space-y-3">
                        <Skeleton className="h-44 w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex gap-4 items-start">
                        <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const AuctionsListSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-3 md:p-4 space-y-3">
                        <Skeleton className="h-44 w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex gap-4 items-start">
                        <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const MyBidsTabSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => (
    <div className="space-y-6">
        <BidsSummarySkeleton />
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="rounded-xl border border-border p-4 space-y-3">
                    <div>
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </aside>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-9" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                </div>
                <BidsListSkeleton viewMode={viewMode} />
            </div>
        </div>
    </div>
);

export const MyAuctionsTabSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <Skeleton className="h-10 flex-1 sm:max-w-md" />
                <Skeleton className="h-10 w-full sm:w-[200px]" />
            </div>
            <Skeleton className="hidden md:block h-9 w-28" />
        </div>
        <AuctionsListSkeleton viewMode={viewMode} />
    </div>
);