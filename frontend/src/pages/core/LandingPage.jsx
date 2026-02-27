import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome to {import.meta.env.VITE_APP_NAME}
                    </h1>
                    <p className="text-md mt-2 text-base-content/70">
                        Buy and sell products easily
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/onboarding")}
                    >
                        Create Account
                    </button>

                    <button className="btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
