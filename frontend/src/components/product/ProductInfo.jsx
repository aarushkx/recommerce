import {
    User,
    MapPin,
    Heart,
    CalendarCheck,
    Info,
    Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavorites } from "../../api/user.api";
import { createBooking } from "../../api/bookings.api";
import { useFavorites, useAuth, useUserBookings } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";

const ProductInfo = ({ product }) => {
    const {
        _id,
        title,
        price,
        description,
        condition,
        location,
        seller,
        category,
        status,
    } = product;

    const queryClient = useQueryClient();
    const { data: favorites } = useFavorites();
    const { data: currentUser } = useAuth();
    const { data: userBookings } = useUserBookings();

    const isFavorite = favorites?.some((fav) => fav._id === _id);
    const isOwner = currentUser?._id === seller?._id;
    const isBooked = userBookings?.some(
        (booking) =>
            booking.product?._id === _id &&
            booking.buyer?._id === currentUser?._id,
    );

    const mutation = useMutation({
        mutationFn: addToFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    const bookingMutation = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", _id] });
            queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
        },
    });

    const handleAddFavorite = () => {
        mutation.mutate(_id);
    };

    const handleBooking = () => {
        bookingMutation.mutate(_id);
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {category}
                    </span>
                    <span className="text-xs text-base-content/40">•</span>
                    <span
                        className={`text-xs font-bold uppercase ${
                            status === "available"
                                ? "text-success"
                                : "text-warning"
                        }`}
                    >
                        {status}
                    </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-base-content">
                    {title}
                </h1>

                <p className="mt-1 text-xl font-semibold">
                    ₹{price?.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Details */}
            <div className="space-y-4 text-sm text-base-content/80">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Info size={14} className="text-base-content/50" />
                        <span className="badge badge-ghost badge-sm font-medium capitalize">
                            {condition}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <User size={14} className="text-base-content/50" />
                        <span>
                            Listed by{" "}
                            <Link
                                to={`/user/${seller?._id}`}
                                className="font-semibold text-base-content hover:underline"
                            >
                                {seller?.name}
                            </Link>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-base-content/50" />
                        <span>
                            {location?.area}, {location?.city},{" "}
                            {location?.state}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <h3 className="mb-1 text-xs font-bold uppercase text-base-content/50">
                        Description
                    </h3>
                    <p className="leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
                <button
                    className="btn btn-primary gap-2"
                    disabled={
                        isOwner ||
                        bookingMutation.isPending ||
                        status !== "available"
                    }
                    onClick={handleBooking}
                >
                    {bookingMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Booking...
                        </>
                    ) : (
                        <>
                            <CalendarCheck size={18} />
                            Book Now
                        </>
                    )}
                </button>

                <button
                    className="btn btn-outline gap-2"
                    disabled={
                        isOwner ||
                        isFavorite ||
                        bookingMutation.isPending ||
                        status !== "available" ||
                        isBooked
                    }
                    onClick={handleAddFavorite}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Heart
                                size={18}
                                className={isFavorite ? "fill-current" : ""}
                            />
                            {isFavorite
                                ? "Added to Favorites"
                                : "Add to Favorites"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
