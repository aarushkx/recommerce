import { Loader2 } from "lucide-react";
import useOrders from "../../hooks/useOrders";
import OrderCard from "../../components/commerce/OrderCard";

const OrdersPage = () => {
    const { data: orders, isLoading } = useOrders();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading your orders...</span>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex items-center justify-center py-24 text-base-content/60">
                <p>No orders received yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

            <div className="divide-y divide-base-200">
                {orders.map((booking) => (
                    <OrderCard key={booking._id} booking={booking} />
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
