import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Menu,
    Heart,
    Gavel,
    Search,
    BookOpen,
    ShoppingBag,
    HelpCircle,
    CalendarDays,
    ChevronDown,
    Grid3x3,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/features/auth/context/UserContext";
import { authService } from "@/features/auth/services/authService";
import Cookies from "js-cookie";
import { useHome } from "@/features/home/hooks/useHome";
import {
    buildAuctionCategoryHref,
    fallbackAuctionCategories,
} from "@/lib/publicAuctionCategories";

interface MobileMenuProps {
    isLoggedIn?: boolean;
}

const MobileMenu = ({ isLoggedIn: defaultIsLoggedIn }: MobileMenuProps) => {
    const router = useRouter();
    const { isLoggedIn: userIsLoggedIn, setUser } = useUser();
    const { useCategories } = useHome();
    const categoriesQuery = useCategories();
    const categories =
        categoriesQuery.data?.data?.length ? categoriesQuery.data.data : fallbackAuctionCategories;
    const navCategories = categories.slice(0, 12);
    const [open, setOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [auctionsOpen, setAuctionsOpen] = useState(false);

    // Use context's isLoggedIn if available, otherwise fall back to prop
    const loggedIn = userIsLoggedIn || defaultIsLoggedIn || false;

    const handleNavigate = (path: string) => {
        router.push(path);
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            Cookies.remove("bidooze_token");
            setUser(null);
            router.push("/");
            setOpen(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-87.5 p-0">
                <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="text-left">
                        <Link href={"/"}>
                            <Image
                                src="/logo/Bidooze.svg"
                                alt="Bidooze logo"
                                width={500}
                                height={500}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100%-65px)]">
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="space-y-1 px-2">
                            {/* Categories */}
                            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                                    <span className="flex items-center gap-3">
                                        <Grid3x3 className="h-4 w-4" />
                                        Search by Category
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-10 pr-3 py-2 space-y-1">
                                    {navCategories.map((category) => (
                                        <button
                                            key={category.slug}
                                            onClick={() => handleNavigate(buildAuctionCategoryHref(category.slug))}
                                            className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Watch List */}
                            <button
                                onClick={() => handleNavigate("/bids")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <Heart className="h-4 w-4" />
                                Watch List
                            </button>

                            {/* Bids */}
                            <button
                                onClick={() => handleNavigate("/bids")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <Gavel className="h-4 w-4" />
                                Bids
                            </button>

                            {/* Find Auctions */}
                            <Collapsible open={auctionsOpen} onOpenChange={setAuctionsOpen}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                                    <span className="flex items-center gap-3">
                                        <Search className="h-4 w-4" />
                                        Find Auctions
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${auctionsOpen ? "rotate-180" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-10 pr-3 py-2 space-y-1">
                                    <button onClick={() => handleNavigate("/auctions")} className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground">
                                        Browse All Auctions
                                    </button>
                                    <button onClick={() => handleNavigate("/auctions?auction_status=upcoming")} className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground">
                                        Upcoming Auctions
                                    </button>
                                    <button onClick={() => handleNavigate("/auctions?auction_status=live")} className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground">
                                        Live Auctions
                                    </button>
                                    <button onClick={() => router.push("/auctions/state")} className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground">
                                        Auctions by State
                                    </button>
                                    <button onClick={() => handleNavigate("/auctioneers")} className="block w-full text-left text-sm py-1.5 text-muted-foreground hover:text-foreground">
                                        Auctioneer Search
                                    </button>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Blog */}
                            <button
                                onClick={() => handleNavigate("/blog")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <BookOpen className="h-4 w-4" />
                                Blog
                            </button>

                            {/* Sell */}
                            <button
                                onClick={() => handleNavigate("/auctioneers")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Sell
                            </button>

                            {/* Calendar */}
                            <button
                                onClick={() => handleNavigate("/calendar")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <CalendarDays className="h-4 w-4" />
                                Calendar
                            </button>

                            {/* Help */}
                            <button
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Help
                            </button>
                        </div>
                    </nav>

                    {/* Auth Section */}
                    <div className="border-t border-border p-4 space-y-2">
                        {loggedIn ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() => handleNavigate("/account")}
                                >
                                    <User className="h-4 w-4" />
                                    Account
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    className="w-full"
                                    onClick={() => handleNavigate("/auth/signup")}
                                >
                                    Sign up
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleNavigate("/auth/login")}
                                >
                                    Login
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
