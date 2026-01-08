import { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = [
  "Antiques & Collectibles",
  "Art",
  "Boats & Aviation",
  "Business & Industrial",
  "Cars & Vehicles",
  "Coins & Currency",
  "Computers & Electronics",
  "Construction & Farm",
  "Fashion",
  "Furniture",
  "Home Goods & Decor",
  "Jewelry, Watches & Gemstones",
  "Kid & Baby Essentials",
  "Lawn & Garden",
  "Real Estate",
  "Sporting Goods",
  "Toys",
];

const CategorySelection = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">What do you like to shop for?</h2>
        <p className="text-sm text-muted-foreground mt-1">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            onClick={() => toggleCategory(category)}
            className="h-auto py-2.5 text-sm text-left justify-start transition-all hover:scale-[1.02]"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
