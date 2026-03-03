import useProducts from "./useProducts";
import { useMemo } from "react";

const useUserProducts = (userId) => {
    const { data: products, isLoading } = useProducts();

    const userProducts = useMemo(() => {
        if (!products || !userId) return [];
        return products.filter((product) => product.seller?._id === userId);
    }, [products, userId]);

    return {
        data: userProducts,
        isLoading,
    };
};

export default useUserProducts;
