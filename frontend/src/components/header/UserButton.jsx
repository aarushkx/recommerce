import {
    User,
    LogOut,
    Settings,
    CreditCard,
    ShoppingBag,
    UserCircle,
    X,
    MessageSquareText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

const UserButton = () => {
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const closeDrawer = () => {
        const checkbox = document.getElementById("user-drawer");
        if (checkbox) checkbox.checked = false;
    };

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            // Close drawer before navigating
            closeDrawer();
            navigate("/login");
        },
    });

    const menuItems = [
        {
            label: "Profile",
            icon: <UserCircle className="h-5 w-5" />,
            onClick: () => navigate("/profile"),
        },
        {
            label: "Account",
            icon: <User className="h-5 w-5" />,
            onClick: () => navigate("/account"),
        },
        {
            label: "Bookings",
            icon: <CreditCard className="h-5 w-5" />,
            onClick: () => navigate("/bookings"),
        },
        {
            label: "Sales",
            icon: <ShoppingBag className="h-5 w-5" />,
            onClick: () => navigate("/sales"),
        },
        {
            label: "Feedback",
            icon: <MessageSquareText className="h-5 w-5" />,
            onClick: () => navigate("/feedback"),
        },
        {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            onClick: () => navigate("/settings"),
        },
        {
            label: "Logout",
            icon: <LogOut className="h-5 w-5" />,
            onClick: () => logoutMutation.mutate(),
            className: "text-error mt-4 border-t border-base-200 pt-4",
        },
    ];

    return (
        <div className="drawer drawer-end w-auto">
            <input id="user-drawer" type="checkbox" className="drawer-toggle" />

            {/* Trigger Button */}
            <div className="drawer-content">
                <label
                    htmlFor="user-drawer"
                    className="btn btn-ghost btn-circle avatar drawer-button"
                >
                    <div className="w-8 rounded-full border border-base-300">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt="User Avatar" />
                        ) : (
                            <img
                                src={`/default-avatar.png`}
                                alt="Default Avatar"
                            />
                        )}
                    </div>
                </label>
            </div>

            {/* Sidebar Overlay and Content */}
            <div className="drawer-side z-60">
                <label
                    htmlFor="user-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <div className="p-0 w-80 min-h-full bg-base-100 text-base-content shadow-xl flex flex-col">
                    {/* User Header Section */}
                    <div className="p-6 bg-base-200/50">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-3">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-primary/60">
                                        {user?.avatar?.url ? (
                                            <img
                                                src={user.avatar.url}
                                                alt="Profile"
                                            />
                                        ) : (
                                            <img
                                                src={`/default-avatar.png`}
                                                alt="Default Avatar"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {user?.name || "Guest User"}
                                    </h2>
                                    <p className="text-xs opacity-60">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <label
                                htmlFor="user-drawer"
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X className="h-5 w-5" />
                            </label>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <ul className="menu p-4 text-base-content grow">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        item.onClick();
                                        closeDrawer();
                                    }}
                                    className={`py-3 ${item.className || ""}`}
                                >
                                    {item.icon}
                                    <span className="text-md">
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserButton;
