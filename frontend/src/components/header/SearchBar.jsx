import { Search } from "lucide-react";
import { useProductFilters } from "../../hooks";
import DebouncedInput from "../input/DebouncedInput";

const SearchBar = () => {
    const {
        filters: { search },
        setFilter,
    } = useProductFilters();

    return (
        <label className="input input-bordered flex items-center gap-2 w-full">
            <Search className="h-4 w-4 opacity-50 shrink-0" />
            <DebouncedInput
                className="grow without-ring"
                placeholder="Search products..."
                value={search || ""}
                onChange={(val) => setFilter("search", val)}
            />
        </label>
    );
};

export default SearchBar;
