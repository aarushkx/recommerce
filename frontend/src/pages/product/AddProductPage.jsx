import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/products.api";
import AddImage from "../../components/product/AddImage";
import { Loader2 } from "lucide-react";

const AddProductPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        tags: "",
        condition: "used",
        area: "",
        pincode: "",
        city: "",
        state: "",
        country: "India",
    });

    const [images, setImages] = useState([]);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate("/home");
        },
    });

    const conditions = [
        { label: "New", value: "new" },
        { label: "Used", value: "used" },
        { label: "Refurbished", value: "refurbished" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (value) => {
        if (value === "") {
            setFormData((prev) => ({ ...prev, price: "" }));
            return;
        }
        const numValue = parseFloat(value);
        setFormData((prev) => ({
            ...prev,
            price: Math.max(0, numValue).toString(),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        // Append non-location fields
        Object.keys(formData).forEach((key) => {
            if (
                !["area", "pincode", "city", "state", "country"].includes(key)
            ) {
                data.append(key, formData[key]);
            }
        });

        // Append location only if user didn't select current location
        if (!useCurrentLocation) {
            const location = {
                area: formData.area,
                city: formData.city,
                pincode: formData.pincode,
                state: formData.state,
                country: formData.country,
            };

            data.append("location", JSON.stringify(location));
        }

        // Append images
        images.forEach((img) => {
            data.append("images", img.file);
        });

        mutation.mutate(data);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold">Add a Product</h1>
                <p className="mt-2 text-base-content/60">
                    Fill in the details below to list your item on the
                    marketplace.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <section>
                    <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-6">
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="form-control sm:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Product Title
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. iPhone 15 Pro Max"
                                    className="input input-bordered w-full"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Price (INR)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0"
                                    className="input input-bordered w-full"
                                    value={formData.price}
                                    onChange={(e) =>
                                        handlePriceChange(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Description
                                </span>
                            </label>
                            <textarea
                                name="description"
                                className="textarea h-32 w-full"
                                placeholder="Describe the item's features, flaws, or history..."
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                    </div>
                </section>

                <div className="divider" />

                {/* Categorization */}
                <section>
                    <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-6">
                        Categorization
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Category
                                </span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                placeholder="Electronics, Furniture…"
                                className="input input-bordered w-full"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Condition
                                </span>
                            </label>
                            <select
                                name="condition"
                                className="select select-bordered w-full"
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                {conditions.map((condition) => (
                                    <option
                                        key={condition.value}
                                        value={condition.value}
                                    >
                                        {condition.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Tags
                                </span>
                            </label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="#iphone, #apple, #bestprice"
                                className="input input-bordered w-full"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </section>

                <div className="divider" />

                {/* Location */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs uppercase tracking-widest text-primary font-bold">
                            Location Details
                        </h2>
                        <label className="label cursor-pointer gap-2">
                            <span className="label-text text-sm">
                                Same as my current location
                            </span>
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={useCurrentLocation}
                                onChange={(e) =>
                                    setUseCurrentLocation(e.target.checked)
                                }
                            />
                        </label>
                    </div>

                    {!useCurrentLocation && (
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Area / Street
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="area"
                                    placeholder="Area / Street"
                                    className="input input-bordered w-full"
                                    onChange={handleInputChange}
                                    required={!useCurrentLocation}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            City
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        className="input input-bordered w-full"
                                        onChange={handleInputChange}
                                        required={!useCurrentLocation}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Pincode
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        className="input input-bordered w-full"
                                        onChange={handleInputChange}
                                        required={!useCurrentLocation}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            State
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        className="input input-bordered w-full"
                                        onChange={handleInputChange}
                                        required={!useCurrentLocation}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Country
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        className="input input-bordered w-full"
                                        onChange={handleInputChange}
                                        required={!useCurrentLocation}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <div className="divider" />

                {/* Images */}
                <section>
                    <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-4">
                        Product Gallery
                    </h2>
                    <AddImage images={images} setImages={setImages} />
                    <p className="mt-4 text-xs text-base-content/50">
                        Add clear, high-quality images. The first image is your
                        thumbnail.
                    </p>
                </section>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary w-full sm:w-auto sm:px-12 flex items-center gap-2"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {mutation.isPending ? "Adding..." : "Add Product"}
                    </button>
                </div>

                {/* Error */}
                <div>
                    {mutation.isError && (
                        <p className="text-error text-sm">
                            {mutation.error?.response?.data?.message ||
                                mutation.error?.message ||
                                "Something went wrong"}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
