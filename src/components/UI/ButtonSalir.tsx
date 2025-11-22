import {
    LogOutIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppDispatch } from '../../hooks/reducer'
import { removeTournament } from '../../reducers/tournamentSlice'

const ButtonSalir = () => {
    const dispatch = useAppDispatch()
    const { logout } = useAuth()
    const handleLogout = async () => {
        await logout()
        dispatch(removeTournament())
    }
    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark transition-colors"
        >
            <LogOutIcon size={20} />
            <span className="text-sm font-medium">Salir</span>
        </button>
    )
}

export default ButtonSalir