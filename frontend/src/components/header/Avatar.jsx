import {
    User,
    LogOut,
    Settings,
    CreditCard,
    ShoppingBag,
    UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

const Avatar = () => {
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/login");
        },
    });

    const closeDropdown = () => {
        const elem = document.activeElement;
        if (elem instanceof HTMLElement) elem.blur();
    };

    const menuItems = [
        {
            label: "Profile",
            icon: <UserCircle className="h-4 w-4" />,
            onClick: () => navigate("/profile"),
        },
        {
            label: "Account",
            icon: <User className="h-4 w-4" />,
            onClick: () => navigate("/account"),
        },
        {
            label: "Bookings",
            icon: <CreditCard className="h-4 w-4" />,
            onClick: () => navigate("/bookings"),
        },
        {
            label: "Sales",
            icon: <ShoppingBag className="h-4 w-4" />,
            onClick: () => navigate("/sales"),
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
            onClick: () => navigate("/settings"),
        },
        {
            label: "Logout",
            icon: <LogOut className="h-4 w-4" />,
            onClick: () => logoutMutation.mutate(),
            className: "text-error",
        },
    ];

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                {user?.avatar?.url ? (
                    <div className="w-8 rounded-full">
                        <img src={user.avatar.url} alt="User Avatar" />
                    </div>
                ) : (
                    <User className="h-5 w-5" />
                )}
            </button>

            <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
            >
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={() => {
                                item.onClick();
                                closeDropdown();
                            }}
                            className={item.className || ""}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Avatar;
