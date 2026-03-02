import { LandingPage, LoginPage, OnboardingPage, HomePage } from "../pages";
import UserProfile from "../pages/user/UserProfile";

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
        element: <UserProfile />,
        protected: true,
    },
];
