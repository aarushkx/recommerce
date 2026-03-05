import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProduct } from "../../hooks";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductInfo from "../../components/product/ProductInfo";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { data: product, isLoading } = useProduct(productId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading product...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-base-content/60">
                    Product not found
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductImageGallery
                    images={product.images}
                    title={product.title}
                />
                <ProductInfo product={product} />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
