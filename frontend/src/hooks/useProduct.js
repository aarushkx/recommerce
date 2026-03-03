import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById } from "../api/products.api";

const useProduct = (productId) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProductById(productId),
        enabled: !!productId,
        initialData: () => {
            const products = queryClient.getQueriesData({
                queryKey: ["products"],
            });

            for (const [, data] of products) {
                const found = data?.find?.((p) => p._id === productId);
                if (found) return found;
            }
        },
    });
};

export default useProduct;
