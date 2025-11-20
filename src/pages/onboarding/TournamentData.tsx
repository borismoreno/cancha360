import { useAuth } from "../../context/AuthContext"

const TournamentData = () => {
    const { logout } = useAuth()
    const handleLogout = async () => {
        await logout()
    }
    return (
        <>
            <div>TournamentData</div>
            <button onClick={handleLogout}>Cerrar</button>
        </>
    )
}

export default TournamentData