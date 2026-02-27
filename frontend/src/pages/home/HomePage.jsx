import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
    const { data: user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/login");
        },
    });

    const handleLogout = () => {
        mutation.mutate();
    };

    return (
        <div>
            <h1>Welcome {user?.name}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;
