import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/user.api";
import { logoutUser } from "../../api/auth.api";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    visible,
    toggleVisibility,
}) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm text-base-content/60 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            {label}
        </label>

        <div className="relative">
            <input
                type={visible ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className="input input-bordered w-full pr-10"
            />

            <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition"
            >
                {visible ? (
                    <EyeOff className="w-4 h-4" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
            </button>
        </div>
    </div>
);

const UpdatePasswordPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [visibility, setVisibility] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [error, setError] = useState("");

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: async () => {
            await logoutUser();
            queryClient.clear();
            navigate("/login");
        },
        onError: (err) => {
            setError(err?.response?.data?.message || "Password update failed");
        },
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const toggleVisibility = (field) => {
        setVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.oldPassword) return setError("Old password is required");

        if (formData.newPassword.length < 6)
            return setError("Password must be at least 6 characters");

        if (formData.newPassword !== formData.confirmPassword)
            return setError("Passwords do not match");

        const data = new FormData();
        data.append("oldPassword", formData.oldPassword);
        data.append("newPassword", formData.newPassword);
        data.append("confirmPassword", formData.confirmPassword);

        updateMutation.mutate(data);
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-2xl mx-auto">
                {/* HEADER */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Change Password</h1>
                    <p className="text-base-content/60 text-sm">
                        For security reasons, you’ll be logged out after
                        updating your password
                    </p>
                </div>

                <div className="divider my-8" />

                {/* FORM SECTION */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <PasswordInput
                            label="Old Password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            visible={visibility.oldPassword}
                            toggleVisibility={() =>
                                toggleVisibility("oldPassword")
                            }
                        />

                        <PasswordInput
                            label="New Password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            visible={visibility.newPassword}
                            toggleVisibility={() =>
                                toggleVisibility("newPassword")
                            }
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            visible={visibility.confirmPassword}
                            toggleVisibility={() =>
                                toggleVisibility("confirmPassword")
                            }
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm">{error}</div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-base-300">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate("/account")}
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
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
