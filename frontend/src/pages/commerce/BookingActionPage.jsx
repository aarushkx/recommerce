import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    Loader2,
    Calendar,
    MapPin,
    CheckCircle2,
    XCircle,
    PackageCheck,
    Mail,
} from "lucide-react";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useBooking from "../../hooks/useBooking";
import {
    confirmBooking,
    cancelBooking,
    completeBooking,
} from "../../api/bookings.api";

const BookingActionPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: booking, isLoading } = useBooking(bookingId);

    const updateMutation = useMutation({
        mutationFn: ({ id, actionFn }) => actionFn(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["booking", bookingId]);
            queryClient.invalidateQueries(["orders"]);
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading booking...</span>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-24 text-base-content/60">
                Booking not found.
            </div>
        );
    }

    const { product, buyer, status, createdAt } = booking;

    const isUpdating = updateMutation.isPending;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Header */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content mb-6 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Orders
            </button>

            <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Product Section */}
                <div className="p-6 flex flex-col md:flex-row gap-6 border-b border-base-200">
                    <div className="h-32 w-32 shrink-0">
                        <img
                            src={
                                product?.images?.[0]?.url || "/placeholder.png"
                            }
                            alt={product?.title}
                            className="h-full w-full object-cover rounded-xl bg-base-200"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h1 className="text-xl font-bold">
                                {product?.title}
                            </h1>

                            <p className="text-xl font-bold text-primary">
                                ₹{product?.price?.toLocaleString("en-IN")}
                            </p>
                        </div>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Booked on: {moment(createdAt).format("lll")}
                                </span>
                            </div>

                            {product?.location && (
                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        {product.location.area},{" "}
                                        {product.location.city},{" "}
                                        {product.location.state} -{" "}
                                        {product.location.pincode},{" "}
                                        {product.location.country}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buyer and Status Section */}
                <div className="p-6 bg-base-200/30 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                            Customer Details
                        </h3>
                        <p className="font-medium">{buyer?.name}</p>
                        <p className="text-sm text-base-content/60">
                            {buyer?.email}
                        </p>
                    </div> */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                            Customer Details
                        </h3>

                        <p className="font-medium">{buyer?.name}</p>

                        <p className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                            <Mail className="h-4 w-4" />
                            {buyer?.email}
                        </p>

                        {buyer?.location && (
                            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {buyer.location.area}, {buyer.location.city}
                                    , {buyer.location.state} -{" "}
                                    {buyer.location.pincode},{" "}
                                    {buyer.location.country}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                            Current Status
                        </h3>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase border
                            ${
                                status === "pending"
                                    ? "bg-warning/10 text-warning border-warning/20"
                                    : status === "confirmed"
                                      ? "bg-success/10 text-success border-success/20"
                                      : status === "completed"
                                        ? "bg-secondary/10 text-secondary border-secondary/20"
                                        : "bg-error/10 text-error border-error/20"
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 flex gap-3">
                    {status === "pending" && (
                        <>
                            <button
                                disabled={isUpdating}
                                onClick={() =>
                                    updateMutation.mutate({
                                        id: bookingId,
                                        actionFn: confirmBooking,
                                    })
                                }
                                className="btn btn-success flex-1 text-white flex items-center justify-center gap-2"
                            >
                                {isUpdating &&
                                updateMutation.variables?.actionFn ===
                                    confirmBooking ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                Confirm Order
                            </button>

                            <button
                                disabled={isUpdating}
                                onClick={() =>
                                    updateMutation.mutate({
                                        id: bookingId,
                                        actionFn: cancelBooking,
                                    })
                                }
                                className="btn btn-outline btn-error flex-1 flex items-center justify-center gap-2"
                            >
                                {isUpdating &&
                                updateMutation.variables?.actionFn ===
                                    cancelBooking ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircle className="h-4 w-4" />
                                )}
                                Cancel Order
                            </button>
                        </>
                    )}

                    {status === "confirmed" && (
                        <>
                            <button
                                disabled={isUpdating}
                                onClick={() =>
                                    updateMutation.mutate({
                                        id: bookingId,
                                        actionFn: completeBooking,
                                    })
                                }
                                className="btn btn-secondary flex-1 text-white flex items-center justify-center gap-2"
                            >
                                {isUpdating &&
                                updateMutation.variables?.actionFn ===
                                    completeBooking ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <PackageCheck className="h-4 w-4" />
                                )}
                                Mark as Completed
                            </button>

                            <button
                                disabled={isUpdating}
                                onClick={() =>
                                    updateMutation.mutate({
                                        id: bookingId,
                                        actionFn: cancelBooking,
                                    })
                                }
                                className="btn btn-outline btn-error flex-1 flex items-center justify-center gap-2"
                            >
                                {isUpdating &&
                                updateMutation.variables?.actionFn ===
                                    cancelBooking ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircle className="h-4 w-4" />
                                )}
                                Cancel Order
                            </button>
                        </>
                    )}

                    {(status === "completed" || status === "cancelled") && (
                        <div className="w-full text-center py-2 text-base-content/50 text-sm italic">
                            No further actions available for this {status}{" "}
                            order.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 text-[10px] text-center text-base-content/30 uppercase tracking-widest">
                Booking ID: {booking._id}
            </div>
        </div>
    );
};

export default BookingActionPage;
