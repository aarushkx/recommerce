import { User, MapPin, Heart, CalendarCheck, Info } from "lucide-react";

const ProductInfo = ({ product }) => {
    const {
        title,
        price,
        description,
        condition,
        location,
        seller,
        category,
        status,
    } = product;

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {category}
                    </span>
                    <span className="text-xs text-base-content/40">•</span>
                    <span
                        className={`text-xs font-bold uppercase ${
                            status === "available"
                                ? "text-success"
                                : "text-warning"
                        }`}
                    >
                        {status}
                    </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-base-content">
                    {title}
                </h1>

                <p className="mt-1 text-xl font-semibold">
                    ₹{price?.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Details */}
            <div className="space-y-4 text-sm text-base-content/80">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Info size={14} className="text-base-content/50" />
                        <span className="badge badge-ghost badge-sm font-medium capitalize">
                            {condition}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <User size={14} className="text-base-content/50" />
                        <span>
                            Listed by{" "}
                            <span className="font-semibold text-base-content">
                                {seller?.name}
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-base-content/50" />
                        <span>
                            {location?.area}, {location?.city},{" "}
                            {location?.state}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <h3 className="mb-1 text-xs font-bold uppercase text-base-content/50">
                        Description
                    </h3>
                    <p className="leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
                <button className="btn btn-primary gap-2">
                    <CalendarCheck size={18} />
                    Book Now
                </button>

                <button className="btn btn-outline gap-2">
                    <Heart size={18} />
                    Add to Favorites
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
