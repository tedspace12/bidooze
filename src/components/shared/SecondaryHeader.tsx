'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Gavel, Search, BookOpen, ShoppingBag, Globe, ChevronDown, Grid3x3, Calendar, Store, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHome } from "@/features/home/hooks/useHome";
import {
  buildAuctionCategoryHref,
  fallbackAuctionCategories,
} from "@/lib/publicAuctionCategories";

const SecondaryHeader = () => {
  const router = useRouter();
  const { useCategories } = useHome();
  const categoriesQuery = useCategories();
  const categories =
    categoriesQuery.data?.data?.length ? categoriesQuery.data.data : fallbackAuctionCategories;
  const navCategories = categories.slice(0, 6);

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
            <DropdownMenuContent
              align="center"
              className="bg-background w-70 md:w-130 p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {navCategories.map((category) => (
                  <div key={category.id}>
                    {/* Parent Title */}
                    <h4
                      onClick={() => router.push(buildAuctionCategoryHref(category.slug))}
                      className="font-semibold text-xs mb-2 text-foreground cursor-pointer hover:underline"
                    >
                      {category.name}
                    </h4>
                    {/* Subcategories */}
                    <div className="space-y-1.5">
                      {category.subcategories?.slice(0, 5).map((sub) => (
                        <DropdownMenuItem
                          key={sub.id}
                          className="text-sm rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer"
                          onClick={() =>
                            router.push(buildAuctionCategoryHref(sub.slug))
                          }
                        >
                          {sub.name}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => router.push('/watchlist')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
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
              <DropdownMenuItem onClick={() => router.push("/auctions?auction_status=upcoming")}>
                Upcoming Auctions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auctions?auction_status=live")}>
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

          <button onClick={() => router.push('/sell')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
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

          <button onClick={() => router.push('/help')} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
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
