import { MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";

const OrderCard = ({ booking }) => {
    const product = booking.product;

    return (
        <Link
            to={`/booking/action/${booking._id}`}
            className="p-4 md:p-6 flex flex-col md:flex-row gap-4 hover:bg-base-200/50 transition-colors"
        >
            {/* Product Image */}
            <div className="h-24 w-24 md:h-32 md:w-32 shrink-0">
                <img
                    src={product?.images?.[0]?.url || "/placeholder.png"}
                    alt={product?.title}
                    className="h-full w-full object-cover rounded-lg bg-base-200"
                />
            </div>

            {/* Order Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg leading-tight">
                            {product?.title}
                        </h2>
                        <p className="font-bold text-primary">
                            ₹{product?.price?.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="mt-1 space-y-1">
                        <p className="text-sm flex items-center gap-1 text-base-content/70">
                            <Calendar className="h-3 w-3" />
                            Booked on: {moment(booking.createdAt).format("lll")}
                        </p>

                        <p className="text-sm text-base-content/70">
                            Buyer:{" "}
                            <span className="font-medium text-base-content">
                                {booking.buyer?.name}
                            </span>
                        </p>

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

                <div className="mt-4 flex items-center justify-between">
                    <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border ${
                            booking.status === "pending"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : booking.status === "cancelled"
                                  ? "bg-error/10 text-error border-error/20"
                                  : booking.status === "confirmed"
                                    ? "bg-success/10 text-success border-success/20"
                                    : booking.status === "completed"
                                      ? "bg-secondary/10 text-secondary border-secondary/20"
                                      : "bg-base-200 text-base-content/70 border-base-300"
                        }`}
                    >
                        {booking.status}
                    </span>

                    <span className="text-[10px] text-base-content/40 uppercase">
                        ID: {booking._id}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default OrderCard;
