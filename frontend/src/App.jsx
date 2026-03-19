import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./config/RoutesConfig";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import AdminRoute from "./components/auth/AdminRoute";
import MainLayout from "./layouts/MainLayout";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => {
                    let content = route.element;
                    if (route.adminOnly) {
                        content = (
                            <AdminRoute>
                                <MainLayout>{route.element}</MainLayout>
                            </AdminRoute>
                        );
                    } else if (route.protected) {
                        content = (
                            <ProtectedRoute>
                                <MainLayout>{content}</MainLayout>
                            </ProtectedRoute>
                        );
                    } else if (route.publicOnly) {
                        content = <PublicRoute>{content}</PublicRoute>;
                    }
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={content}
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
