import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.api";
import { useAuth } from "../../hooks";
import MainSidebar from "../sidebar/MainSidebar";

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
            closeDrawer();
            navigate("/login");
        },
    });

    const handleNavigation = (path) => {
        navigate(path);
        closeDrawer();
    };

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
                        <img
                            src={user?.avatar?.url || "/default-avatar.png"}
                            alt="User Avatar"
                        />
                    </div>
                </label>
            </div>

            {/* Sidebar */}
            <MainSidebar
                user={user}
                onNavigate={handleNavigation}
                onLogout={() => logoutMutation.mutate()}
            />
        </div>
    );
};

export default UserButton;
