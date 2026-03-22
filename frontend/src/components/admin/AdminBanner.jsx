import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { ArrowRight } from "lucide-react";

const AdminBanner = () => {
    const { data: user } = useAuth();
    const location = useLocation();

    const isAdminPage = location.pathname.startsWith("/admin");

    if (!user || user.role !== "admin") return null;

    return (
        <div className="w-full bg-warning/20 text-warning border-b border-warning/30 text-xs py-1 flex items-center justify-center gap-2">
            <span className="font-medium">You are viewing as Admin</span>

            {isAdminPage ? (
                <Link
                    to="/home"
                    className="flex items-center gap-1 font-semibold underline hover:text-warning-content transition"
                >
                    <span>Go to Home</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            ) : (
                <Link
                    to="/admin"
                    className="flex items-center gap-1 font-semibold underline hover:text-warning-content transition"
                >
                    <span>Go to Admin Panel</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            )}
        </div>
    );
};

export default AdminBanner;
