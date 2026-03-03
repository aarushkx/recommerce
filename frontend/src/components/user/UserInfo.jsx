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

    const rating = user.rating || 0; // fallback

    return (
        <div className="flex-1 w-full max-w-md space-y-6">
            <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />

            <InfoRow
                icon={MapPin}
                label="Location"
                value={user.location?.city}
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

                <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <input
                            key={star}
                            type="radio"
                            name="user-rating"
                            className="mask mask-star-2 bg-orange-400"
                            aria-label={`${star} star`}
                            checked={rating === star}
                            readOnly
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
