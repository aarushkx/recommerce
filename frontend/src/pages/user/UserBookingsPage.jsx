import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../../api/bookings.api";
import useUserBookings from "../../hooks/useUserBookings";
import { Loader2, Package, Calendar, User } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ booking, onCancel, cancelling }) => {
    const product = booking.product;
    const seller = booking.seller;
    const navigate = useNavigate();

    return (
        <div className="border border-base-300 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-4">
                <img
                    src={product?.images?.[0]?.url}
                    alt={product?.title}
                    className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                    <a
                        className="font-bold cursor-pointer"
                        onClick={() => navigate(`/products/${product._id}`)}
                    >
                        {product?.title}
                    </a>

                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                        ₹{product?.price}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
                <User className="w-4 h-4 text-primary" />
                <a
                    className="cursor-pointer"
                    onClick={() => navigate(`/seller/${seller._id}`)}
                >
                    {seller?.name}
                </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Calendar className="w-4 h-4 text-primary" />
                Booked on {moment(booking.createdAt).format("Do MMM YYYY")}
            </div>

            <div className="pt-2">
                <button
                    className="btn btn-outline btn-error btn-sm"
                    onClick={() => onCancel(booking._id)}
                    disabled={cancelling}
                >
                    {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cancel Booking
                </button>
            </div>
        </div>
    );
};

const UserBookingsPage = () => {
    const queryClient = useQueryClient();

    const { data: bookings, isLoading } = useUserBookings();

    const cancelMutation = useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
        },
    });

    const handleCancel = (bookingId) => {
        cancelMutation.mutate(bookingId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-16">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <p className="text-base-content/60 text-sm">
                    View and manage all your bookings
                </p>
            </div>

            <div className="divider my-8" />

            {bookings?.length === 0 ? (
                <div className="text-center py-12 text-base-content/60">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-60" />
                    You have no bookings yet
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings?.map((booking) => (
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                            onCancel={handleCancel}
                            cancelling={cancelMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookingsPage;
