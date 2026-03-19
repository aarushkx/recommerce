import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Loader2, ArrowLeft } from "lucide-react";

const AdminRoute = ({ children }) => {
    const { data: user, isLoading } = useAuth();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not authenticated
    if (!user) return <Navigate to="/login" replace />;

    // Not admin
    if (user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold text-error">
                        403 - Not Authorized
                    </h1>
                    <p className="text-base-content/60 mt-2">
                        You don't have permission to access this page.
                    </p>
                    <button
                        className="btn btn-sm btn-secondary mt-4"
                        onClick={() => navigate("/home")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
