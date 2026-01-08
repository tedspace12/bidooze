'use client';

// import QuickLinks from "./components/QuickLinks";
import HeroCarousel from "./components/HeroCarousel";
import FeaturedAuctions from "./components/FeaturedAuctions";
import CategoryGrid from "./components/CategoryGrid";
import TopPicks from "./components/TopPicks";
import HotAuctions from "./components/HotAuctions";

export const Home = () => {
    return (
            <main>
                <HeroCarousel />
                <FeaturedAuctions />
                <CategoryGrid />
                <TopPicks />
                <HotAuctions />
            </main>
    )
}