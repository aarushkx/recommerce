import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Product from "../models/product.model.js";

export const createBooking = async (req, res) => {
    // We use Atomic Transactions to carry out booking
    // For this, we create a mongoose session (transaction) to ensure that if creating the booking fails,
    // the product status isn't stuck as "booked"
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId } = req.params;
        const buyerId = req.user._id;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(productId).session(session);
        if (!product) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is available
        if (product.status !== "available") {
            await session.abortTransaction();
            return res
                .status(400)
                .json({ message: "Product is not available for booking" });
        }

        // Prevent seller booking their own product
        if (product.seller.toString() === buyerId.toString()) {
            await session.abortTransaction();
            return res
                .status(400)
                .json({ message: "You cannot book your own product" });
        }

        // Prevent duplicate booking
        const existingBooking = await Booking.findOne({
            product: productId,
            buyer: buyerId,
            status: { $in: ["pending", "confirmed"] },
        }).session(session);

        if (existingBooking) {
            await session.abortTransaction();
            return res
                .status(400)
                .json({ message: "You have already booked this product" });
        }

        // Create booking
        const newBooking = new Booking({
            product: productId,
            buyer: buyerId,
            seller: product.seller,
            priceAtBooking: product.price,
        });
        await newBooking.save({ session });

        // Update product status to "booked"
        product.status = "booked";
        await product.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(newBooking);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log("ERROR :: CONTROLLER :: createBooking ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const buyerId = req.user._id;

        const bookings = await Booking.find({ buyer: buyerId })
            .populate({
                path: "product",
                select: "title price images status category condition",
            })
            .populate({
                path: "seller",
                select: "name email phoneNumber avatar rating",
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(bookings);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getMyBookings ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMySales = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const bookings = await Booking.find({ seller: sellerId })
            .populate({
                path: "product",
                select: "title price images status category condition",
            })
            .populate({
                path: "buyer",
                select: "name email avatar rating",
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(bookings);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getMySales ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSingleBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId))
            return res.status(400).json({ message: "Invalid booking ID" });

        // Find the booking
        const booking = await Booking.findById(bookingId)
            .populate({
                path: "product",
                select: "title price images status category condition location",
            })
            .populate({
                path: "buyer",
                select: "name email phoneNumber avatar location rating",
            })
            .populate({
                path: "seller",
                select: "name email phoneNumber avatar location rating",
            })
            .lean();

        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        // Authorization check to ensure only the buyer or seller can view this
        const isBuyer = booking.buyer._id.toString() === userId.toString();
        const isSeller = booking.seller._id.toString() === userId.toString();

        if (!isBuyer && !isSeller)
            return res.status(403).json({
                message: "You are not authorized to view this booking",
            });

        return res.status(200).json(booking);
    } catch (error) {
        console.log(
            "ERROR :: CONTROLLER :: getSingleBooking ::",
            error.message,
        );
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId))
            return res.status(400).json({ message: "Invalid booking ID" });

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        // Ensure only the seller can confirm the booking
        if (booking.seller.toString() !== userId.toString())
            return res.status(403).json({ message: "Only seller can confirm" });

        // Booking can only be confirmed if it's currently pending
        if (booking.status !== "pending")
            return res.status(400).json({ message: "Booking is not pending" });

        booking.status = "confirmed";
        await booking.save();

        // Auto-cancel all other pending bookings for this product
        await Booking.updateMany(
            {
                product: booking.product,
                _id: { $ne: bookingId },
                status: "pending",
            },
            { $set: { status: "cancelled" } },
        );

        return res.status(200).json(booking);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: confirmBooking ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId))
            return res.status(400).json({ message: "Invalid booking ID" });

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        // Authorization check to ensure only buyer or seller can cancel
        const isBuyer = booking.buyer.toString() === userId.toString();
        const isSeller = booking.seller.toString() === userId.toString();

        if (!isBuyer && !isSeller)
            return res.status(403).json({
                message: "You are not authorized to cancel this booking",
            });

        // Cannot cancel if the booking is already "completed" or "cancelled"
        if (booking.status === "completed")
            return res.status(400).json({
                message: "Cannot cancel. Booking is already completed.",
            });

        if (booking.status === "cancelled")
            return res.status(400).json({
                message: "Booking is already cancelled",
            });

        // Cancel the booking
        booking.status = "cancelled";
        await booking.save();

        // Make the product available again
        await Product.findByIdAndUpdate(booking.product, {
            $set: { status: "available" },
        });

        return res.status(200).json(booking);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: cancelBooking ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const completeBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId))
            return res.status(400).json({ message: "Invalid booking ID" });

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        // Authorization check to ensure that only the seller can complete the booking
        if (booking.seller.toString() !== userId.toString())
            return res.status(403).json({
                message: "Only the seller can complete this booking",
            });

        // Booking must be confirmed first
        if (booking.status !== "confirmed")
            return res.status(400).json({
                message: "Booking must be confirmed before completing",
            });

        // Mark the booking as completed
        booking.status = "completed";
        await booking.save();

        // Mark the product as sold
        await Product.findByIdAndUpdate(booking.product, {
            $set: { status: "sold" },
        });

        // Add the product to buyer's purchased list
        await User.findByIdAndUpdate(booking.buyer, {
            $push: { purchased: booking.product },
        });

        // Add the product to seller's sold list
        await User.findByIdAndUpdate(booking.seller, {
            $push: { sold: booking.product },
        });

        return res.status(200).json(booking);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: completeBooking ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
