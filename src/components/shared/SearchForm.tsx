'use client';

import { useState, type FormEvent } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const geocodeZip = async (zip: string): Promise<{ lat: number; lng: number } | null> => {
    if (!MAPS_KEY) return null;
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zip)}&key=${MAPS_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
            return data.results[0].geometry.location;
        }
    } catch {
        // geocode failed — fall back to zip_code text filter
    }
    return null;
};

export const SearchForm = ({ isMobile = false }: { isMobile?: boolean }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [distance, setDistance] = useState("50");
    const [isLocating, setIsLocating] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const useMyLocation = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setCoords(c);
                setZipCode("Current location");
                setIsLocating(false);
            },
            () => setIsLocating(false)
        );
    };

    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        setIsSubmitting(true);

        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        let resolvedCoords = coords;
        if (!resolvedCoords && zipCode.trim() && zipCode !== "Current location") {
            resolvedCoords = await geocodeZip(zipCode.trim());
        }

        if (resolvedCoords) {
            params.set("near_lat", String(resolvedCoords.lat));
            params.set("near_lng", String(resolvedCoords.lng));
            if (distance && distance !== "anywhere") params.set("radius", distance);
            params.set("radius_unit", "miles");
        } else if (zipCode.trim() && zipCode !== "Current location") {
            params.set("zip_code", zipCode.trim());
        }

        router.push(`/auctions${params.size ? `?${params.toString()}` : ""}`);
        setIsSubmitting(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-2 ${isMobile ? "flex-col w-full" : "flex-1 min-w-0"}`}
        >
            <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isMobile ? "w-full" : "flex-1 min-w-0"}
            />
            <div className={`flex gap-2 ${isMobile ? "w-full" : "hidden lg:flex"}`}>
                <div className="relative">
                    <Input
                        placeholder="Zip / city"
                        value={zipCode}
                        onChange={(e) => { setZipCode(e.target.value); setCoords(null); }}
                        className={`pr-8 ${isMobile ? "w-full" : "w-36"}`}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-8 text-muted-foreground hover:text-foreground"
                        onClick={useMyLocation}
                        disabled={isLocating}
                        title="Use my location"
                    >
                        {isLocating
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <MapPin className="h-3.5 w-3.5" />}
                    </Button>
                </div>
                <Select value={distance} onValueChange={setDistance}>
                    <SelectTrigger className={isMobile ? "flex-1" : "w-36"}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="anywhere">Anywhere</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="100">100 miles</SelectItem>
                        <SelectItem value="250">250 miles</SelectItem>
                        <SelectItem value="500">500 miles</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                type="submit"
                size={isMobile ? "default" : "icon"}
                className={isMobile ? "w-full" : "shrink-0"}
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Search className="h-4 w-4" />}
                {isMobile && !isSubmitting && <span className="ml-2">Search</span>}
            </Button>
        </form>
    );
};
