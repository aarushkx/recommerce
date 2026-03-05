import { useState } from "react";
import { useAuth } from "../../hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../api/user.api";
import {
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Lock,
    ShieldAlert,
    Package,
    Heart,
    ShoppingBag,
    Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;

    return (
        <div className="flex items-start gap-4 transition-all duration-200 hover:translate-x-1">
            <div className="p-2 rounded-xl bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
            </div>

            <div className="flex flex-col">
                <span className="text-sm text-base-content/60">{label}</span>
                <span className="text-base font-medium wrap-break-word">
                    {value}
                </span>
            </div>
        </div>
    );
};

const UserAccountPage = () => {
    const { data: user, isLoading } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.clear();
            navigate("/login");
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    const fullLocation = [
        user?.location?.area,
        user?.location?.city,
        user?.location?.state,
        user?.location?.country,
        user?.location?.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* HEADER */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Account</h1>
                    <p className="text-base-content/60 text-sm">
                        Manage your account settings and actions
                    </p>
                </div>

                <div className="divider my-8" />

                {/* ACCOUNT INFORMATION */}
                <div className="space-y-8">
                    <h2 className="text-xl font-semibold">
                        Account Information
                    </h2>

                    <div className="space-y-6">
                        <InfoRow
                            icon={User}
                            label="Full Name"
                            value={user.name}
                        />
                        <InfoRow
                            icon={Mail}
                            label="Email Address"
                            value={user.email}
                        />
                        <InfoRow
                            icon={Phone}
                            label="Phone Number"
                            value={user.phoneNumber}
                        />
                        <InfoRow
                            icon={MapPin}
                            label="Location"
                            value={fullLocation}
                        />
                    </div>

                    <div className="pt-6 space-y-1 text-base-content/70">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-sm">
                                You've been a member since{" "}
                                <span className="font-medium text-base-content">
                                    {moment(user.createdAt).format(
                                        "Do MMMM, YYYY",
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divider my-8" />

                {/* ACTIVITY SUMMARY */}
                <div className="space-y-8">
                    <h2 className="text-xl font-semibold">Activity Summary</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition">
                            <Package className="w-6 h-6 text-primary" />
                            <span className="text-lg font-semibold">
                                {user.products?.length || 0}
                            </span>
                            <span className="text-xs text-base-content/60">
                                Listed
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                            <span className="text-lg font-semibold">
                                {user.sold?.length || 0}
                            </span>
                            <span className="text-xs text-base-content/60">
                                Sold
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                            <span className="text-lg font-semibold">
                                {user.purchased?.length || 0}
                            </span>
                            <span className="text-xs text-base-content/60">
                                Purchased
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition">
                            <Heart className="w-6 h-6 text-primary" />
                            <span className="text-lg font-semibold">
                                {user.favorites?.length || 0}
                            </span>
                            <span className="text-xs text-base-content/60">
                                Favorites
                            </span>
                        </div>
                    </div>

                    {user.isSeller && user.rating && (
                        <div className="pt-6 flex items-center gap-3">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm text-base-content/70">
                                Seller Rating:
                            </span>
                            <span className="font-semibold text-base-content">
                                {user.rating.toFixed(1)} / 5
                            </span>
                        </div>
                    )}
                </div>

                <div className="divider my-8" />

                {/* SECURITY */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Security</h2>

                    <button
                        className="btn btn-outline btn-primary w-fit"
                        onClick={() => navigate("/update-password")}
                    >
                        <Lock className="w-4 h-4" />
                        Change Password
                    </button>
                </div>

                <div className="divider my-8" />

                {/* DANGER ZONE */}
                <div className="space-y-6 ">
                    <h2 className="text-xl font-semibold text-error">
                        Danger Zone
                    </h2>

                    <p className="text-sm text-base-content/70">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                    </p>

                    <button
                        className="btn btn-error w-fit"
                        onClick={() => setShowConfirm(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* CONFIRM DELETE MODAL */}
            {showConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box space-y-4">
                        <h3 className="font-bold text-lg text-error">
                            Confirm Account Deletion
                        </h3>
                        <p className="text-sm">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={() => deleteMutation.mutate()}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAccountPage;
