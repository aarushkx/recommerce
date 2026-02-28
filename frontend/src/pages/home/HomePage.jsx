import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";
import useProductFilterStore from "../../store/product-filter.store";
import ProductCard from "../../components/product/ProductCard";
import { Loader2 } from "lucide-react";

const HomePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Auth
    const { data: user } = useAuth();

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/login");
        },
    });

    // Products
    const { data: products, isLoading } = useProducts();
    const { page, setPage } = useProductFilterStore();

    return (
        <div className="min-h-screen p-6 space-y-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Hello, {user?.name}</h1>

                <button
                    className="btn btn-outline btn-error"
                    onClick={() => logoutMutation.mutate()}
                >
                    Logout
                </button>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading products...</span>
                </div>
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            className="btn btn-outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <button
                            className="btn btn-outline"
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
