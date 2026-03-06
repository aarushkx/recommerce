import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useAuth, useUserProducts } from "../../hooks";
import ProductCard from "../../components/product/ProductCard";

const UserProductGrid = () => {
    const navigate = useNavigate();
    const { data: user } = useAuth();

    // Fetching data from API by filtering
    const { data: products, isLoading } = useUserProducts(user?._id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading your products...</span>
            </div>
        );
    }

    // No products case
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold">
                        Post your first product
                    </h3>
                    <p className="text-sm text-base-content/60">
                        Start selling by adding your first listing.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/create-product")}
                >
                    Add Product
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Section Title */}
            <h3 className="text-2xl font-semibold">Products Listed by You</h3>

            {/* Same Grid as HomePage */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default UserProductGrid;
