import { Search } from "lucide-react";
import { useProductFilters } from "../../hooks";

const SearchBar = () => {
    const {
        filters: { search },
        setFilter,
    } = useProductFilters();

    return (
        <label className="input input-bordered flex items-center gap-2 w-full">
            <Search className="h-4 w-4 opacity-50 shrink-0" />
            <input
                type="text"
                className="grow without-ring"
                placeholder="Search products..."
                value={search || ""}
                onChange={(e) => setFilter("search", e.target.value)}
            />
        </label>
    );
};

export default SearchBar;
