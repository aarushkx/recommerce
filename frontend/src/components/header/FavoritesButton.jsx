import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FavoritesButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/favorites")}
            className="btn btn-ghost btn-circle"
        >
            <Heart className="h-5 w-5" />
        </button>
    );
};

export default FavoritesButton;
