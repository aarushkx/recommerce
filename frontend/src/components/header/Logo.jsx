import { useNavigate } from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();

    return (
        <h1
            onClick={() => navigate("/home")}
            className="text-lg font-bold cursor-pointer select-none"
        >
            {import.meta.env.VITE_APP_NAME}
        </h1>
    );
};

export default Logo;
