import { useNavigate } from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/home")}
            className="flex cursor-pointer select-none items-center"
        >
            {/* Mobile */}
            <img
                src="/logo.png"
                alt="Logo"
                className="block h-8 w-8 object-contain md:hidden"
            />
            {/* Desktop */}
            <h1 className="hidden text-lg font-bold md:block">
                {import.meta.env.VITE_APP_NAME}
            </h1>
        </div>
    );
};

export default Logo;
