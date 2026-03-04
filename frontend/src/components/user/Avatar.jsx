import { User } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Avatar = ({ size = "w-24" }) => {
    const { data: user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="avatar placeholder">
                <div
                    className={`${size} rounded-full bg-base-300 animate-pulse`}
                />
            </div>
        );
    }

    if (!user) return null;

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="avatar">
            <div
                className={`${size} rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}
            >
                {user.avatar?.url ? (
                    <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="object-cover"
                    />
                ) : user.name ? (
                    <div className="bg-primary text-primary-content flex items-center justify-center text-xl font-semibold">
                        {getInitials(user.name)}
                    </div>
                ) : (
                    <div className="bg-base-300 flex items-center justify-center">
                        <User className="w-8 h-8 text-base-content opacity-60" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Avatar;
