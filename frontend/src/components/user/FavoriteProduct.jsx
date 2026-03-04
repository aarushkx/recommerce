import { Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FavoriteProduct = ({ product, onRemove, isRemoving }) => {
    const navigate = useNavigate();

    return (
        <div
            className="flex items-center gap-4 px-2 py-4 hover:bg-base-200/80 cursor-pointer transition"
            onClick={() => navigate(`/products/${product._id}`)}
        >
            {/* Product Image */}
            <img
                src={
                    product.images?.[0]?.url ||
                    "https://placehold.co/200x200?text=?"
                }
                alt={product.title}
                className="w-14 h-14 object-cover rounded-md shrink-0"
            />

            {/* Title and Price */}
            <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium truncate">{product.title}</p>

                <p className="text-sm text-base-content/70">
                    ₹{product.price?.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Delete Button */}
            <button
                className="cursor-pointer text-error hover:bg-error/10 p-2 rounded-md transition"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(product._id);
                }}
                disabled={isRemoving}
            >
                {isRemoving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 size={18} />
                )}
            </button>
        </div>
    );
};

export default FavoriteProduct;
