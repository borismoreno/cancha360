import { useAuth } from "../context/AuthContext"
export const Dashboard = () => {
    const { logout } = useAuth()
    return (
        <>
            <div>Dashboard</div>
            <button onClick={() => logout()}>Cerrar Sesión</button>
        </>
    )
}
