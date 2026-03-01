import { SlidersHorizontal } from "lucide-react";
import useProductFilterStore from "../../store/product-filter.store";

const Filter = () => {
    const {
        sort,
        category,
        city,
        minPrice,
        maxPrice,
        search,
        setFilter,
        resetFilters,
    } = useProductFilterStore();

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "price_asc", label: "Price Low" },
        { value: "price_desc", label: "Price High" },
    ];

    // Helper function to prevent negative numbers
    const handlePriceChange = (key, value) => {
        const numValue = parseFloat(value);
        if (value === "") {
            setFilter(key, "");
            return;
        }
        setFilter(key, Math.max(0, numValue).toString());
    };

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
                <SlidersHorizontal className="h-5 w-5" />
            </button>

            <div
                tabIndex={0}
                className="dropdown-content menu p-5 shadow-2xl bg-base-100 rounded-box w-80 mt-3 border border-base-200"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button
                        onClick={() => resetFilters?.()}
                        className="btn btn-ghost btn-xs text-error underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Search Field */}
                    <div className="form-control">
                        <label className="label-text font-semibold mb-1 text-xs uppercase opacity-60">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Title or description..."
                            className="input input-sm input-bordered w-full"
                            value={search || ""}
                            onChange={(e) =>
                                setFilter("search", e.target.value)
                            }
                        />
                    </div>

                    {/* Category and City */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                            <label className="label-text font-semibold mb-1 text-xs uppercase opacity-60">
                                Category
                            </label>
                            <input
                                type="text"
                                placeholder="Electronics"
                                className="input input-sm input-bordered w-full"
                                value={category || ""}
                                onChange={(e) =>
                                    setFilter("category", e.target.value)
                                }
                            />
                        </div>
                        <div className="form-control">
                            <label className="label-text font-semibold mb-1 text-xs uppercase opacity-60">
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="Lucknow"
                                className="input input-sm input-bordered w-full"
                                value={city || ""}
                                onChange={(e) =>
                                    setFilter("city", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="form-control">
                        <label className="label-text font-semibold mb-1 text-xs uppercase opacity-60">
                            Price Range
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                placeholder="Min"
                                className="input input-sm input-bordered w-full"
                                value={minPrice || ""}
                                onChange={(e) =>
                                    handlePriceChange(
                                        "minPrice",
                                        e.target.value,
                                    )
                                }
                            />
                            <span className="opacity-50">-</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="Max"
                                className="input input-sm input-bordered w-full"
                                value={maxPrice || ""}
                                onChange={(e) =>
                                    handlePriceChange(
                                        "maxPrice",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="form-control">
                        <label className="label-text font-semibold mb-1 text-xs uppercase opacity-60">
                            Sort By
                        </label>
                        <select
                            className="select select-sm select-bordered w-full"
                            value={sort}
                            onChange={(e) => setFilter("sort", e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
