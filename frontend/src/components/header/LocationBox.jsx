import { MapPin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LocationBox = () => {
    const { data: user } = useAuth();

    if (!user?.location) return null;

    return (
        <div className="hidden md:flex items-center gap-1 text-sm text-base-content/70">
            <MapPin className="h-4 w-4" />
            <span>
                {user.location.city}, {user.location.state}
            </span>
        </div>
    );
};

export default LocationBox;
