'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Gavel, Search, BookOpen, ShoppingBag, Globe, ChevronDown, Grid3x3, Calendar, Store, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SecondaryHeader = () => {
  const router = useRouter();

  return (
    <div className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-14 md:top-16 z-40 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 lg:gap-8 h-10 text-sm overflow-x-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                <Grid3x3 className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search by</span> Category
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background w-[280px] md:w-[600px] p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-foreground">Popular</h4>
                  <div className="space-y-2">
                    <DropdownMenuItem>Antiques & Collectibles</DropdownMenuItem>
                    <DropdownMenuItem>Art</DropdownMenuItem>
                    <DropdownMenuItem>Cars & Vehicles</DropdownMenuItem>
                    <DropdownMenuItem>Jewelry & Watches</DropdownMenuItem>
                    <DropdownMenuItem>Real Estate</DropdownMenuItem>
                  </div>
                </div>
                <div className="hidden md:block">
                  <h4 className="font-semibold text-sm mb-3 text-foreground">Lifestyle</h4>
                  <div className="space-y-2">
                    <DropdownMenuItem>Fashion</DropdownMenuItem>
                    <DropdownMenuItem>Home Goods & Decor</DropdownMenuItem>
                    <DropdownMenuItem>Furniture</DropdownMenuItem>
                    <DropdownMenuItem>Lawn & Garden</DropdownMenuItem>
                    <DropdownMenuItem>Sporting Goods</DropdownMenuItem>
                  </div>
                </div>
                <div className="hidden md:block">
                  <h4 className="font-semibold text-sm mb-3 text-foreground">Professional</h4>
                  <div className="space-y-2">
                    <DropdownMenuItem>Business & Industrial</DropdownMenuItem>
                    <DropdownMenuItem>Construction & Farm</DropdownMenuItem>
                    <DropdownMenuItem>Computers & Electronics</DropdownMenuItem>
                    <DropdownMenuItem>Boats & Aviation</DropdownMenuItem>
                    <DropdownMenuItem>Coins & Currency</DropdownMenuItem>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Heart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Watch</span> List
          </button>

          <button onClick={() => router.push('/bids')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer whitespace-nowrap">
            <Gavel className="h-3.5 w-3.5" />
            Bids
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Find</span> Auctions
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background">
              <DropdownMenuItem onClick={() => router.push("/auctions")}>
                Browse All Auctions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auctions?status=upcoming")}>
                Upcoming Auctions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auctions?status=live")}>
                Live Auctions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auctions/state")}>
                Auctions by State
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auctioneers")}>
                Auctioneer Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => router.push('/auctioneers')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Store className="h-3.5 w-3.5" />
            Auctioneer Search
          </button>

          <button onClick={() => router.push('/blog')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </button>

          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <ShoppingBag className="h-3.5 w-3.5" />
            Sell
          </button>

          <button onClick={() => router.push('/calendar')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5" />
            Calendar
          </button>

          {/* <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-3.5 w-3.5" />
            Join mailing list
          </button> */}
          {/* <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-3.5 w-3.5" />
            Manage notifications
          </button> */}

          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="h-3.5 w-3.5" />
            Help
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                <Globe className="h-3.5 w-3.5" />
                EN
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
