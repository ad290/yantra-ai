import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSelector } from "../../features/auth/store/hooks";

const PublicRoute = () => {
    const location = useLocation();
    const user = useAuthSelector((state) => state.user.userData);

    if (user && (location.pathname === "/login" || location.pathname === "/register")) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;