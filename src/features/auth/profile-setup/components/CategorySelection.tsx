import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@bprogress/next/app";
import { useHome } from "@/features/home/hooks/useHome";
import { fallbackAuctionCategories } from "@/lib/publicAuctionCategories";

const CategorySelection = () => {
  const router = useRouter();
  const { useCategories } = useHome();
  const categoriesQuery = useCategories();
  const categories =
    categoriesQuery.data?.data?.length ? categoriesQuery.data.data : fallbackAuctionCategories;

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">What do you like to shop for?</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
            onClick={() => toggleCategory(category.id)}
            className="h-auto py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm text-left justify-start transition-all hover:scale-[1.02] whitespace-normal leading-tight"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="flex justify-between pt-4 sm:pt-6 gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/')} className="flex-1 sm:flex-none">
          Skip
        </Button>
        <Button type="submit" onClick={() => router.push('/')} className="flex-1 sm:flex-none">
          Finish
        </Button>
      </div>
    </div>
  );
};

export default CategorySelection;
