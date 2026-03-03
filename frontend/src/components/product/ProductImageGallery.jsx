import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageGallery = ({ images = [], title }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1,
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1,
        );
    };

    const currentImageUrl =
        images[currentImageIndex]?.url ||
        "https://placehold.co/800x600?text=No+Image+Available";

    return (
        <div className="space-y-4">
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-base-200">
                <img
                    src={currentImageUrl}
                    alt={title}
                    className="w-full h-full object-contain"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/50 border-none hover:bg-base-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/50 border-none hover:bg-base-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative shrink-0 w-16 h-16 rounded border-2 transition-all ${
                                index === currentImageIndex
                                    ? "border-primary/40"
                                    : "border-transparent opacity-70"
                            }`}
                        >
                            <img
                                src={image.url}
                                className="w-full h-full object-cover"
                                alt="Product"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;
