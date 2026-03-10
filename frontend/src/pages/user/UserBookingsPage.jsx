import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../../api/bookings.api";
import { useUserBookings } from "../../hooks";
import { Loader2, Package } from "lucide-react";
import BookingCard from "../../components/booking/BookingCard";

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
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading bookings...</span>
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
