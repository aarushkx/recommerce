import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./config/RoutesConfig";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => {
                    let content = route.element;
                    if (route.protected)
                        content = <ProtectedRoute>{content}</ProtectedRoute>;
                    if (route.publicOnly)
                        content = <PublicRoute>{content}</PublicRoute>;
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
