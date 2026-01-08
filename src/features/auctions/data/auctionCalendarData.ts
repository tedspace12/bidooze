export interface CalendarAuction {
  id: string;
  name: string;
  auctioneer: {
    name: string;
    image: string;
  };
  status: "live" | "closed" | "ending-soon";
  time: string;
  catalogUrl: string;
}

export interface DayAuctions {
  date: Date;
  auctions: CalendarAuction[];
}

// Mock auctioneers for filter
export const auctioneers = [
  { id: "1", name: "Heritage Auctions" },
  { id: "2", name: "Christie's" },
  { id: "3", name: "Sotheby's" },
  { id: "4", name: "Bonhams" },
  { id: "5", name: "Phillips" },
  { id: "6", name: "Wright Auctions" },
];

export const auctionTypes = [
  { id: "live", name: "Live" },
  { id: "timed", name: "Timed" },
  { id: "closing-soon", name: "Closing Soon" },
  { id: "top-picks", name: "Top Picks" },
  { id: "upcoming", name: "Upcoming" },
];

// Generate mock auction data for the calendar
export const generateMockAuctions = (year: number, month: number): Map<string, CalendarAuction[]> => {
  const auctionsMap = new Map<string, CalendarAuction[]>();
  
  const mockAuctions: Omit<CalendarAuction, "id" | "status" | "time">[] = [
    { name: "Fine Art & Antiques", auctioneer: { name: "Heritage Auctions", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/1" },
    { name: "Luxury Timepieces", auctioneer: { name: "Christie's", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/2" },
    { name: "Contemporary Art Evening", auctioneer: { name: "Sotheby's", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/3" },
    { name: "Classic Cars & Automobilia", auctioneer: { name: "Bonhams", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/4" },
    { name: "Photography Auction", auctioneer: { name: "Phillips", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/5" },
    { name: "Modern Design", auctioneer: { name: "Wright Auctions", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/6" },
    { name: "Rare Books & Manuscripts", auctioneer: { name: "Heritage Auctions", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/7" },
    { name: "Jewelry & Gemstones", auctioneer: { name: "Christie's", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, catalogUrl: "/auctions/8" },
  ];

  const times = ["10:00 AM WAT", "02:00 PM WAT", "04:30 PM WAT", "07:00 PM WAT"];
  const statuses: CalendarAuction["status"][] = ["live", "closed", "ending-soon"];
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const numAuctions = Math.floor(Math.random() * 5); // 0-4 auctions per day
    if (numAuctions > 0) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayAuctions: CalendarAuction[] = [];
      
      const currentDate = new Date(year, month, day);
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      for (let i = 0; i < numAuctions; i++) {
        const auction = mockAuctions[Math.floor(Math.random() * mockAuctions.length)];
        let status: CalendarAuction["status"];
        
        if (isPast) {
          status = "closed";
        } else if (currentDate.toDateString() === today.toDateString()) {
          status = statuses[Math.floor(Math.random() * statuses.length)];
        } else {
          status = Math.random() > 0.3 ? "live" : "ending-soon";
        }
        
        dayAuctions.push({
          id: `${dateKey}-${i}`,
          ...auction,
          status,
          time: times[Math.floor(Math.random() * times.length)],
        });
      }
      
      auctionsMap.set(dateKey, dayAuctions);
    }
  }
  
  return auctionsMap;
};
