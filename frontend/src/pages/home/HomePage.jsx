import { useProducts } from "../../hooks";
import useProductFilters from "../../hooks/useProductFilters";
import ProductCard from "../../components/product/ProductCard";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

const HomePage = () => {
    const { data, isLoading } = useProducts();
    const { filters, setPage } = useProductFilters();

    const products = data?.products;
    const pagination = data?.pagination;

    return (
        <div className="min-h-screen p-6 space-y-8">
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
                    {pagination && (
                        <div className="flex items-center justify-center gap-4 pt-6">
                            <button
                                className="btn btn-sm btn-outline flex items-center gap-1"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => setPage(filters.page - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <span className="text-xs text-base-content/60">
                                Page {pagination.page} of{" "}
                                {pagination.totalPages}
                            </span>

                            <button
                                className="btn btn-sm btn-outline flex items-center gap-1"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setPage(filters.page + 1)}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
