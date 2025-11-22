import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function useRouteGuard() {
    const { user, profile, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Consideramos "cargando" mientras loading sea true o el user exista pero el perfil aún no llega
    const isAuthResolving = loading || (user && !profile)

    const isPublicPath = ["/login", "/signup"].includes(location.pathname)
    const isActivationPath = ["/activacion", "/solicitar-codigo"].includes(location.pathname)

    useEffect(() => {
        if (isAuthResolving) return

        if (!user) {
            if (!isPublicPath) navigate("/login", { replace: true })
            return
        }

        if (profile?.is_superadmin) {
            if (!location.pathname.startsWith("/superadmin")) {
                navigate("/superadmin", { replace: true })
            }
            return
        }

        if (!profile?.has_active_code) {
            if (!isActivationPath) navigate("/activacion", { replace: true })
            return
        }

        if (!profile?.has_active_tournament) {
            if (!location.pathname.startsWith("/onboarding")) {
                navigate("/onboarding/campeonato/datos", { replace: true })
            }
            return
        }

        if (
            isPublicPath ||
            isActivationPath ||
            location.pathname.startsWith("/onboarding")
        ) {
            navigate("/dashboard", { replace: true })
        }
    }, [user, profile, isAuthResolving, isPublicPath, isActivationPath, location.pathname, navigate])

    return {
        loading: isAuthResolving,
        user,
        profile,
    }
}
