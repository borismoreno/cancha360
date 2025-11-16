import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function OrganizerRoute() {
    const { user, profile, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

    // No logueado
    if (!user) return <Navigate to="/login" replace />;

    // Si es superadmin → redirige a su panel propio
    if (profile?.is_superadmin) {
        return <Navigate to="/superadmin" replace />;
    }

    // Es organizador → deja pasar
    return <Outlet />;
}
