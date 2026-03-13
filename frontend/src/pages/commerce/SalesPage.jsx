import { Loader2 } from "lucide-react";
import useOrders from "../../hooks/useOrders";
import SaleCard from "../../components/commerce/SalesCard";

const SalesPage = () => {
    const { data: orders, isLoading } = useOrders();

    // Filter only show completed bookings
    const sales =
        orders?.filter((booking) => booking.status === "completed") || [];

    // Calculate earning from completed sales
    const totalEarnings = sales.reduce(
        (acc, booking) => acc + (booking.product?.price || 0),
        0,
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading your sales...</span>
            </div>
        );
    }

    if (sales.length == 0) {
        return (
            <div className="flex items-center justify-center py-24 text-base-content/60">
                <p>You have not made any sales yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-base-200">
                <div>
                    <h1 className="text-2xl font-bold">Your Sales</h1>
                    <p className="text-sm text-base-content/60">
                        Manage your successful transactions
                    </p>
                </div>

                <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 min-w-50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-base-content/50">
                        Total Earning
                    </p>
                    <p className="text-2xl font-bold text-primary">
                        ₹{totalEarnings.toLocaleString("en-IN")}
                    </p>
                </div>
            </div>

            <div className="divide-y divide-base-200">
                {sales.map((booking) => (
                    <SaleCard key={booking._id} booking={booking} />
                ))}
            </div>
        </div>
    );
};

export default SalesPage;
