'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PrimaryHeader = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [distance, setDistance] = useState("50");

  return (
    <div className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 h-16">
          <Link href={"/"}>
            <Image
              src="/logo/Bidooze.svg"
              alt="Bidooze logo"
              width={500}
              height={500}
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex-1 flex items-center gap-3 max-w-3xl">
            <Input
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-32"
            />
            <Select value={distance} onValueChange={setDistance}>
              <SelectTrigger className="w-40">
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
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <a href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </a>
                <a href="/auth/signup">
                  <Button size="sm">Sign up</Button>
                </a>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Welcome, User
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem onClick={() => router.push('/account')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryHeader;
