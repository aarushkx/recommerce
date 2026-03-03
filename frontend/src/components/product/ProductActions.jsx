import { Heart, CalendarCheck } from "lucide-react";

const ProductActions = () => {
    return (
        <div className="mt-8 flex flex-col gap-3">
            <button className="btn btn-primary gap-2">
                <CalendarCheck size={18} />
                Book Now
            </button>

            <button className="btn btn-outline gap-2">
                <Heart size={18} />
                Add to Favorites
            </button>
        </div>
    );
};

export default ProductActions;
