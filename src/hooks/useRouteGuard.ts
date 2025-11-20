import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useRouteGuard() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        // 1️⃣ Usuario NO autenticado → solo permitir rutas públicas
        if (!user) {
            if (location.pathname !== "/login" && location.pathname !== "/signup") {
                navigate("/login", { replace: true });
            }
            return;
        }

        // 2️⃣ Si es superadmin → siempre redirigir a /superadmin
        if (profile?.is_superadmin) {
            if (!location.pathname.startsWith("/superadmin")) {
                navigate("/superadmin", { replace: true });
            }
            return;
        }

        // 3️⃣ Si usuario NO tiene código de acceso → forzar /activate
        if (!profile?.has_active_code) {
            if (location.pathname !== "/activacion" && location.pathname !== "/solicitar-codigo") {
                navigate("/activacion", { replace: true });
            }
            return;
        }

        // 4️⃣ Si tiene código pero NO tiene torneo → forzar onboarding
        if (profile?.has_active_code && !profile?.has_active_tournament) {
            if (!location.pathname.startsWith("/onboarding")) {
                navigate("/onboarding/campeonato/datos", { replace: true });
            }
            return;
        }

        // 5️⃣ Si tiene torneo activo → permitir dashboard
        if (
            profile?.has_active_code &&
            profile?.has_active_tournament &&
            (location.pathname === "/login" ||
                location.pathname === "/signup" ||
                location.pathname === "/activacion" ||
                location.pathname === "/solicitar-codigo" ||
                location.pathname.startsWith("/onboarding"))
        ) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, profile, loading, location.pathname]);

    return {
        loading,
        user,
        profile,
    };
}
