import { Phone, MapPin, Calendar } from "lucide-react";
import moment from "moment";

const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;

    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary shrink-0" />
            <div className="flex flex-col">
                <span className="text-sm text-base-content/60">{label}</span>
                <span className="text-base font-medium">{value}</span>
            </div>
        </div>
    );
};

const UserInfo = ({ user }) => {
    if (!user) return null;

    const rating = user.rating || 0; // Fallback
    const normalizedRating = Math.round(rating * 2) / 2; // Ensure rating is in 0.5 increments

    return (
        <div className="flex-1 w-full max-w-md space-y-6">
            <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />

            <InfoRow
                icon={MapPin}
                label="Location"
                value={`${user.location?.city}, ${user.location?.state}`}
            />

            <InfoRow
                icon={Calendar}
                label="Member Since"
                value={
                    user.createdAt ? moment(user.createdAt).format("ll") : null
                }
            />

            {/* Dynamic Rating */}
            <div className="flex flex-col gap-2">
                <span className="text-sm text-base-content/60">Rating</span>

                <div className="rating rating-sm rating-half">
                    <input
                        type="radio"
                        name="user-rating"
                        className="rating-hidden"
                    />

                    {[...Array(10)].map((_, i) => {
                        const value = (i + 1) * 0.5;
                        return (
                            <input
                                key={value}
                                type="radio"
                                name="user-rating"
                                className={`mask mask-star-2 ${
                                    i % 2 === 0 ? "mask-half-1" : "mask-half-2"
                                } bg-orange-400`}
                                aria-label={`${value} star`}
                                checked={normalizedRating === value}
                                readOnly
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
