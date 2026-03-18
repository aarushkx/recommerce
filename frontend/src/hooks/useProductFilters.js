import { useSearchParams } from "react-router-dom";

const DEFAULTS = {
    page: "1",
    limit: "10",
    sort: "newest",
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    search: "",
};

const useProductFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        page: parseInt(searchParams.get("page") || DEFAULTS.page),
        limit: parseInt(searchParams.get("limit") || DEFAULTS.limit),
        sort: searchParams.get("sort") || DEFAULTS.sort,
        category: searchParams.get("category") || "",
        city: searchParams.get("city") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        search: searchParams.get("search") || "",
    };

    const setFilter = (key, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value);
            else next.delete(key);

            // Reset to page 1 whenever a filter changes (not page itself)
            if (key !== "page") next.set("page", "1");
            return next;
        });
    };

    const setPage = (page) => setFilter("page", String(page));
    const resetFilters = () => setSearchParams({});

    return { filters, setFilter, setPage, resetFilters };
};

export default useProductFilters;
