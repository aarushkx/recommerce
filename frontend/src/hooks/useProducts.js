import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products.api";
import { useProductFilters } from "./index";

const useProducts = () => {
    const { filters } = useProductFilters();

    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => getProducts(filters),
        keepPreviousData: true,
    });
};

export default useProducts;
