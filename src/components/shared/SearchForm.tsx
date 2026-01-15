import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

export const SearchForm = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [distance, setDistance] = useState("50");

    return (

        <div className={`flex items-center gap-2 ${isMobile ? "flex-col w-full" : "flex-1 max-w-3xl"}`}>
            <Input
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isMobile ? "w-full" : "flex-1"}
            />
            <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
                <Input
                    placeholder="Zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={isMobile ? "flex-1" : "w-32"}
                />
                <Select value={distance} onValueChange={setDistance}>
                    <SelectTrigger className={isMobile ? "flex-1" : "w-40"}>
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
            <Button size={isMobile ? "default" : "icon"} className={isMobile ? "w-full" : ""}>
                <Search className="h-4 w-4" />
                {isMobile && <span className="ml-2">Search</span>}
            </Button>
        </div>
    )
};