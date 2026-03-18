import { SlidersHorizontal, X } from "lucide-react";
import useProductFilters from "../../hooks/useProductFilters";

const Filter = () => {
    const {
        filters: { sort, category, city, minPrice, maxPrice, search },
        setFilter,
        resetFilters,
    } = useProductFilters();

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "price_asc", label: "Price Low" },
        { value: "price_desc", label: "Price High" },
    ];

    const handlePriceChange = (key, value) => {
        const numValue = parseFloat(value);
        if (value === "") {
            setFilter(key, "");
            return;
        }
        setFilter(key, Math.max(0, numValue).toString());
    };

    return (
        <div className="drawer drawer-end w-auto">
            <input
                id="filter-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* Drawer Trigger Button */}
            <div className="drawer-content">
                <label
                    htmlFor="filter-drawer"
                    className="btn btn-ghost btn-circle drawer-button"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                </label>
            </div>

            {/* Drawer Sidebar */}
            <div className="drawer-side z-60">
                <label
                    htmlFor="filter-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <div className="menu p-6 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl">Filters</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => resetFilters?.()}
                                className="btn btn-ghost btn-xs text-error underline"
                            >
                                Clear All
                            </button>
                            <label
                                htmlFor="filter-drawer"
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X className="h-5 w-5" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Search Field */}
                        <div className="form-control">
                            <label className="label-text font-semibold mb-2 text-xs uppercase opacity-60">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Title or description..."
                                className="input input-bordered w-full"
                                value={search || ""}
                                onChange={(e) =>
                                    setFilter("search", e.target.value)
                                }
                            />
                        </div>

                        {/* Category and City */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="form-control">
                                <label className="label-text font-semibold mb-2 text-xs uppercase opacity-60">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    placeholder="Electronics"
                                    className="input input-bordered w-full"
                                    value={category || ""}
                                    onChange={(e) =>
                                        setFilter("category", e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label-text font-semibold mb-2 text-xs uppercase opacity-60">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Lucknow"
                                    className="input input-bordered w-full"
                                    value={city || ""}
                                    onChange={(e) =>
                                        setFilter("city", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="form-control">
                            <label className="label-text font-semibold mb-2 text-xs uppercase opacity-60">
                                Price Range
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    className="input input-bordered w-full"
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
                                    className="input input-bordered w-full"
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
                            <label className="label-text font-semibold mb-2 text-xs uppercase opacity-60">
                                Sort By
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={sort}
                                onChange={(e) =>
                                    setFilter("sort", e.target.value)
                                }
                            >
                                {sortOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Apply Button (Optional) */}
                    <div className="mt-auto pt-6">
                        <label
                            htmlFor="filter-drawer"
                            className="btn btn-primary btn-block"
                        >
                            Apply
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
