import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, User } from "lucide-react";
import moment from "moment";

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

                <div
                    className="flex-1"
                    onClick={() => navigate(`/products/${product._id}`)}
                >
                    <p className="font-bold cursor-pointer">{product?.title}</p>

                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                        ₹{product?.price}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
                <User className="w-4 h-4 text-primary" />
                <p
                    className="cursor-pointer"
                    onClick={() => navigate(`/seller/${seller._id}`)}
                >
                    {seller?.name}
                </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Calendar className="w-4 h-4 text-primary" />
                Booked on {moment(booking.createdAt).format("ll")}
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

export default BookingCard;
