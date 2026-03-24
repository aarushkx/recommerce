import {
    LandingPage,
    LoginPage,
    OnboardingPage,
    HomePage,
    ProductDetailsPage,
    UserProfilePage,
    UserAccountPage,
    UpdateProfilePage,
    UpdatePasswordPage,
    UserFavoritesPage,
    AddProductPage,
    UserFeedbackPage,
    UserBookingsPage,
    OrdersPage,
    SalesPage,
    UserPublicProfilePage,
    AddReviewPage,
    BookingActionPage,
    AdminPage,
} from "../pages";

export const routes = [
    {
        path: "/",
        element: <LandingPage />,
        protected: false,
        publicOnly: true,
    },
    {
        path: "/login",
        element: <LoginPage />,
        protected: false,
        publicOnly: true,
    },
    {
        path: "/onboarding",
        element: <OnboardingPage />,
        protected: false,
        publicOnly: true,
    },
    {
        path: "/home",
        element: <HomePage />,
        protected: true,
    },
    {
        path: "/profile",
        element: <UserProfilePage />,
        protected: true,
    },
    {
        path: "/account",
        element: <UserAccountPage />,
        protected: true,
    },
    {
        path: "/products/:productId",
        element: <ProductDetailsPage />,
        protected: true,
    },
    {
        path: "/update-profile",
        element: <UpdateProfilePage />,
        protected: true,
    },
    {
        path: "/update-password",
        element: <UpdatePasswordPage />,
        protected: true,
    },
    {
        path: "/favorites",
        element: <UserFavoritesPage />,
        protected: true,
    },
    {
        path: "/create-product",
        element: <AddProductPage />,
        protected: true,
    },
    {
        path: "/feedback",
        element: <UserFeedbackPage />,
        protected: true,
    },
    {
        path: "/bookings",
        element: <UserBookingsPage />,
        protected: true,
    },
    {
        path: "/orders",
        element: <OrdersPage />,
        protected: true,
    },
    {
        path: "/sales",
        element: <SalesPage />,
        protected: true,
    },
    {
        path: "/user/:userId",
        element: <UserPublicProfilePage />,
        protected: true,
    },
    {
        path: "/review/:sellerId",
        element: <AddReviewPage />,
        protected: true,
    },
    {
        path: "/booking/action/:bookingId",
        element: <BookingActionPage />,
        protected: true,
    },
    {
        path: "/admin/",
        element: <AdminPage />,
        protected: true,
        adminOnly: true,
    },
];
