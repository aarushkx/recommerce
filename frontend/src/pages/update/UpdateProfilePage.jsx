import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/user.api";
import {
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Home,
    Hash,
    Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const InputField = ({ icon: Icon, label, name, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm text-base-content/60 flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="input input-bordered w-full"
        />
    </div>
);

const UpdateProfilePage = () => {
    const { data: user, isLoading } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        location: {
            area: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
        },
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                location: {
                    area: user?.location?.area || "",
                    city: user?.location?.city || "",
                    state: user?.location?.state || "",
                    country: user?.location?.country || "",
                    pincode: user?.location?.pincode || "",
                },
            });

            setAvatarPreview(user?.avatar?.url || null);
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarFile) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview, avatarFile]);

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["user"] });
            navigate("/profile");
        },
        onError: (err) => {
            setError(err?.response?.data?.message || "Update failed");
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.location) {
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return setError("Only image files are allowed");
        }

        if (file.size > MAX_FILE_SIZE) {
            return setError("Image must be less than 2MB");
        }

        setError("");
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("location", JSON.stringify(formData.location));

        if (avatarFile) {
            data.append("avatar", avatarFile);
        }

        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* HEADER */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Update Profile</h1>
                </div>

                <div className="divider my-8" />

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* AVATAR */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <img
                                src={avatarPreview || "/default-avatar.png"}
                                alt="Avatar"
                                className="w-28 h-28 rounded-full object-cover border-4 border-primary/20"
                            />
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-110 transition">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-base-content/60">
                            Click to change your avatar
                        </p>
                    </div>

                    {/* PERSONAL INFO */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            Personal Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                icon={User}
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={Mail}
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={Phone}
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="divider my-8" />

                    {/* LOCATION */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Location Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                icon={Home}
                                label="Area"
                                name="area"
                                value={formData.location.area}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={MapPin}
                                label="City"
                                name="city"
                                value={formData.location.city}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={Globe}
                                label="State"
                                name="state"
                                value={formData.location.state}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={Globe}
                                label="Country"
                                name="country"
                                value={formData.location.country}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={Hash}
                                label="Pincode"
                                name="pincode"
                                value={formData.location.pincode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-base-300 ">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate("/profile")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
                {error && <div className="text-error text-sm">{error}</div>}
            </div>
        </div>
    );
};

export default UpdateProfilePage;
