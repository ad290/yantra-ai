import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSelector } from '../../features/auth/store/hooks'
const ProtectedRoute = () => {
    const user = useAuthSelector((state) => state.user.userData);
    if (!user) return (
        <Navigate to={"/login"} replace />
    )
    return (
        <Outlet />
    )
}

export default ProtectedRoute;