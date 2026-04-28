'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import MobileMenu from "./MobileMenu";
import { SearchForm } from "./SearchForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useUser } from "@/features/auth/context/UserContext";
import { authService } from "@/features/auth/services/authService";
import Cookies from "js-cookie";

const PrimaryHeader = ({ isLoggedIn }: { isLoggedIn?: boolean } = {}) => {
  const router = useRouter();
  const { user, isLoggedIn: userIsLoggedIn, setUser } = useUser();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Use context's isLoggedIn if available, otherwise fall back to prop
  const loggedIn = userIsLoggedIn || isLoggedIn || false;
  const userName = user?.name || "User";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("bidooze_token");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <div className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 h-14 md:h-16">
          {/* Mobile Menu */}
          <MobileMenu isLoggedIn={isLoggedIn} />

          <Link href={"/"}>
            <Image
              src="/logo/Bidooze.svg"
              alt="Bidooze logo"
              width={500}
              height={500}
              className="h-8 sm:h-10 w-auto shrink-0"
            />
          </Link>

          <div className="hidden md:flex flex-1 items-center gap-3 min-w-0">
            <SearchForm />
          </div>

          {/* Mobile Search Button */}
          <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Search Auctions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <SearchForm isMobile />
              </div>
            </DialogContent>
          </Dialog>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!loggedIn ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Welcome, {userName}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem onClick={() => router.push('/account')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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
