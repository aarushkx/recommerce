import { MapPin, User, ArrowUpRight } from "lucide-react";

const ProductCard = ({ product }) => {
    const { title, price, condition, location, images, seller } = product;
    const productImage =
        images?.[0]?.url ||
        "https://placehold.co/600x400?text=No+Image+Available";

    return (
        <div className="group card card-compact bg-base-100 border border-base-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
            {/* Image Section */}
            <div className="relative aspect-4/3 overflow-hidden">
                <img
                    src={productImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Condition Overlay */}
                {condition && (
                    <div className="absolute top-3 left-3">
                        <span className="badge badge-neutral bg-base-900/80 backdrop-blur-md border-none text-white text-xs font-bold px-3 py-3">
                            {condition.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="card-body p-4 gap-0">
                {/* Title & Action Icon */}
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm md:text-base font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h2>
                    <ArrowUpRight className="w-4 h-4 text-base-content/30 group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>

                {/* Price */}
                <div className="text-lg font-bold text-primary mb-3">
                    ₹{price?.toLocaleString("en-IN")}
                </div>

                {/* Metadata Grid */}
                <div className="flex flex-col gap-2 pt-3 border-t border-base-200">
                    <div className="flex items-center gap-2 text-base-content/60">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-xs font-medium truncate">
                            {location?.city || "Location N/A"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-base-content/60">
                        <User size={14} />
                        <span className="text-[11px] font-medium truncate">
                            Listed by:{" "}
                            <span className="text-base-content font-semibold">
                                {seller?.name || "Unknown"}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Button */}
                <div className="card-actions mt-4">
                    <button className="btn btn-primary btn-sm btn-block">
                        View Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
