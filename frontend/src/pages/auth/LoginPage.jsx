import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/home");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center flex flex-col gap-6">
                <h1 className="text-2xl font-bold">
                    Login to {import.meta.env.VITE_APP_NAME}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <input
                            className="input"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn" type="submit">
                            {mutation.isPending ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm">
                        Don't have an account?{" "}
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => navigate("/onboarding")}
                        >
                            Register
                        </span>
                    </p>
                    {/* Error */}
                    {mutation.isError && (
                        <p className="text-error text-sm">
                            {mutation.error?.response?.data?.message ||
                                mutation.error?.message ||
                                "An error occurred"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
