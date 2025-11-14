import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SuperAdminRoute = () => {
    const { user, profile, loading } = useAuth();

    if (loading) return <div>Cargando Auth...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (!profile?.is_superadmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
