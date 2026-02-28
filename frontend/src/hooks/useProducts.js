import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products.api";
import useProductFilterStore from "../store/product-filter.store";

const useProducts = () => {
    const filters = useProductFilterStore();

    return useQuery({
        queryKey: ["products", filters],
        queryFn: () =>
            getProducts({
                page: filters.page,
                limit: filters.limit,
                category: filters.category,
                city: filters.city,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                search: filters.search,
                sort: filters.sort,
            }),
        keepPreviousData: true,
    });
};

export default useProducts;
