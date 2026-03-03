import {
    LandingPage,
    LoginPage,
    OnboardingPage,
    HomePage,
    UserProfilePage,
} from "../pages";
import ProductDetailsPage from "../pages/product/ProductDetailsPage";

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
        path: "/products/:productId",
        element: <ProductDetailsPage />,
        protected: true,
    },
];
