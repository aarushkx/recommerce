import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { ArrowRight } from "lucide-react";

const AdminBanner = () => {
    const { data: user } = useAuth();

    if (!user || user.role !== "admin") return null;

    return (
        <div className="w-full bg-warning/20 text-warning border-b border-warning/30 text-xs py-1 flex items-center justify-center gap-2">
            <span className="font-medium">You are viewing as Admin</span>

            <Link
                to="/admin"
                className="flex items-center gap-1 font-semibold underline hover:text-warning-content transition"
            >
                <span>Go to Admin Panel</span>
                <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
};

export default AdminBanner;
