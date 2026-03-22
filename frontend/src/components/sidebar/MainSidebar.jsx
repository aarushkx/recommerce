import { useLocation } from "react-router-dom";
import {
    User,
    LogOut,
    Settings,
    CreditCard,
    ShoppingBag,
    UserCircle,
    X,
    MessageSquareText,
    Plus,
    ChartLine,
} from "lucide-react";

const MainSidebar = ({ user, onNavigate, onLogout }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    const userMenuItems = [
        {
            label: "Profile",
            icon: <UserCircle className="h-5 w-5" />,
            onClick: () => onNavigate("/profile"),
        },
        {
            label: "Account",
            icon: <User className="h-5 w-5" />,
            onClick: () => onNavigate("/account"),
        },
        {
            label: "Add Product",
            icon: <Plus className="h-5 w-5" />,
            onClick: () => onNavigate("/create-product"),
        },
        {
            label: "Bookings",
            icon: <CreditCard className="h-5 w-5" />,
            onClick: () => onNavigate("/bookings"),
        },
        {
            label: "Orders",
            icon: <ShoppingBag className="h-5 w-5" />,
            onClick: () => onNavigate("/orders"),
        },
        {
            label: "Sales",
            icon: <ChartLine className="h-5 w-5" />,
            onClick: () => onNavigate("/sales"),
        },
        {
            label: "Feedback",
            icon: <MessageSquareText className="h-5 w-5" />,
            onClick: () => onNavigate("/feedback"),
        },
        {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            onClick: () => onNavigate("/settings"),
        },
        {
            label: "Logout",
            icon: <LogOut className="h-5 w-5" />,
            onClick: onLogout,
            className: "text-error mt-4 border-t border-base-200 pt-4",
        },
    ];

    const adminMenuItems = [
        {
            label: "Profile",
            icon: <UserCircle className="h-5 w-5" />,
            onClick: () => onNavigate("/profile"),
        },
        {
            label: "Account",
            icon: <User className="h-5 w-5" />,
            onClick: () => onNavigate("/account"),
        },
        {
            label: "Feedback",
            icon: <MessageSquareText className="h-5 w-5" />,
            onClick: () => onNavigate("/feedback"),
        },
        {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            onClick: () => onNavigate("/settings"),
        },
        {
            label: "Logout",
            icon: <LogOut className="h-5 w-5" />,
            onClick: onLogout,
            className: "text-error mt-4 border-t border-base-200 pt-4",
        },
    ];

    const menuItems = isAdminPage ? adminMenuItems : userMenuItems;

    return (
        <div className="drawer-side z-50">
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
                                    <img
                                        src={
                                            user?.avatar?.url ||
                                            "/default-avatar.png"
                                        }
                                        alt="Profile"
                                    />
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
                <div className="grow overflow-y-auto">
                    <ul className="menu p-0 w-full">
                        {menuItems.map((item, index) => (
                            <li key={index} className="w-full">
                                <button
                                    onClick={item.onClick}
                                    className={`flex w-full items-center gap-4 px-6 py-4 hover:bg-base-200 transition-all ${item.className || ""}`}
                                >
                                    <span className="opacity-70">
                                        {item.icon}
                                    </span>
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

export default MainSidebar;
