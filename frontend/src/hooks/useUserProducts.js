import useProducts from "./useProducts";
import { useMemo } from "react";

const useUserProducts = (userId) => {
    const { data, isLoading } = useProducts();

    const userProducts = useMemo(() => {
        if (!data || !userId) return [];
        const products = data.products;
        return products.filter((product) => product.seller?._id === userId);
    }, [data, userId]);

    return {
        data: userProducts,
        isLoading,
    };
};

export default useUserProducts;
