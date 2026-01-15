import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group rounded-xl overflow-hidden bg-muted aspect-6/3">
                <Image
                    src={images[selectedIndex]}
                    alt={`${title} - Image ${selectedIndex + 1}`}
                    fill
                    className="object-cover"
                />

                {/* Navigation Arrows */}
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                    onClick={goToPrevious}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                    onClick={goToNext}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Zoom Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                        >
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - Full size`}
                            width={500}
                            height={500}
                            className="w-full h-auto rounded-lg"
                        />
                    </DialogContent>
                </Dialog>

                {/* Image Counter */}
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-muted-foreground/30"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`${title} - Thumbnail ${index + 1}`}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
