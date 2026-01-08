'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Gavel, Search, BookOpen, ShoppingBag, Globe, ChevronDown, Grid3x3, Calendar, Store } from "lucide-react";
import { useRouter } from "next/navigation";

const SecondaryHeader = () => {
  const router = useRouter();

  return (
    <div className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 h-10 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Grid3x3 className="h-3.5 w-3.5" />
                Search by Category
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-background w-[600px] p-6">
              <div className="grid grid-cols-3 gap-4">
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
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-foreground">Lifestyle</h4>
                  <div className="space-y-2">
                    <DropdownMenuItem>Fashion</DropdownMenuItem>
                    <DropdownMenuItem>Home Goods & Decor</DropdownMenuItem>
                    <DropdownMenuItem>Furniture</DropdownMenuItem>
                    <DropdownMenuItem>Lawn & Garden</DropdownMenuItem>
                    <DropdownMenuItem>Sporting Goods</DropdownMenuItem>
                  </div>
                </div>
                <div>
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
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="h-3.5 w-3.5" />
            Watch List
          </button>
          <button onClick={() => router.push('/bids')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Gavel className="h-3.5 w-3.5" />
            Bids
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-3.5 w-3.5" />
                Find Auctions
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
          <button onClick={() => router.push('/auctioneers')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Store className="h-3.5 w-3.5" />
            Auctioneer Search
          </button>
          <button onClick={() => router.push('/blog')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag className="h-3.5 w-3.5" />
            Sell
          </button>
          <button onClick={() => router.push('/calendar')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
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
          {/* <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="h-3.5 w-3.5" />
            Help
          </button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
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
