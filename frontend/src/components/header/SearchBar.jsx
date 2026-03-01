import { Search } from "lucide-react";
import useProductFilterStore from "../../store/product-filter.store";

const SearchBar = () => {
    const { search, setFilter } = useProductFilterStore();

    return (
        <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg w-full max-w-md">
            <Search className="h-4 w-4 text-base-content/60" />
            <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) => setFilter("search", e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
