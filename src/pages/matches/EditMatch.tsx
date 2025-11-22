import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useState } from "react"
import { matchService, type MatchWithTeams } from "../../services/matchService"
import Button from "../../components/UI/Button"
import { useAppSelector } from "../../hooks/reducer"
import { useAppDispatch } from "../../hooks/reducer"
import { removeEditingMatch } from "../../reducers/matchSlice"

const EditMatch = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const [match, setMatch] = useState<MatchWithTeams>()
    const [date, setDate] = useState(match?.scheduled_date || '')
    const [time, setTime] = useState(match?.scheduled_time || '')
    const [status, setStatus] = useState(match?.status)
    const { tournament } = useAppSelector(state => state.tournament)

    const fetchData = async () => {
        const response = await matchService.getMatchById(id!)
        setMatch(response);
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'pending': {
                label: 'Pendiente',
                color: 'bg-state-pending text-white',
            },
            'played': {
                label: 'Jugado',
                color: 'bg-state-played text-white',
            },
            'wo': {
                label: 'W.O.',
                color: 'bg-state-wo text-white',
            },
            'suspended': {
                label: 'Suspendido',
                color: 'bg-state-suspended text-white',
            },
        }
        const config =
            statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
            >
                {config.label}
            </span>
        )
    }

    const handleSave = () => {
        console.log('Saving match:', {
            id: match?.id,
            date,
            time,
            status,
        })
        navigate('/partidos')
    }
    const handleCancel = () => {
        dispatch(removeEditingMatch())
        navigate(`/partidos/${tournament?.id}`)
    }
    const handleRegisterResult = () => {
        navigate(`/partidos/resultado/${match?.id}`)
    }
    const canRegisterResult =
        status === 'played' || status === 'wo' || status === 'suspended'

    return (
        <div className="min-h-screen bg-neutral-light">
            {/* Header */}
            <header className="bg-white border-b border-neutral-medium">
                <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark transition-colors mb-4"
                    >
                        <ArrowLeftIcon size={20} />
                        <span className="text-sm font-medium">Volver a partidos</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">
                            Editar Partido
                        </h1>
                        <p className="text-sm text-neutral-medium mt-1">
                            Asigna fecha, hora y estado del partido.
                        </p>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Teams Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between sm:justify-center gap-4">
                        <span className="font-semibold text-neutral-dark text-lg flex-1 sm:flex-none">
                            {match?.local_team?.name}
                        </span>
                        <span className="text-neutral-medium font-medium text-lg">VS</span>
                        <span className="font-semibold text-neutral-dark text-lg flex-1 sm:flex-none text-right sm:text-left">
                            {match?.visitor_team?.name}
                        </span>
                    </div>
                </div>
                {/* Form */}
                <div className="space-y-6">
                    {/* A. Date and Time Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                            Configuración de Fecha y Hora
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Fecha del partido
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="time"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Hora del partido
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                    {/* B. Status Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                            Estado del Partido
                        </h3>
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-neutral-dark mb-2"
                            >
                                Selecciona el estado
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as string)}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="played">Jugado</option>
                                <option value="wo">W.O. (No presentado)</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                            <div className="mt-3">
                                <span className="text-sm text-neutral-medium">
                                    Estado actual:{' '}
                                </span>
                                {getStatusBadge(status!)}
                            </div>
                        </div>
                    </div>
                    {/* Register Result Button */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-2">
                            Resultado del Partido
                        </h3>
                        <p className="text-sm text-neutral-medium mb-4">
                            Para registrar el resultado del partido, primero guarda los
                            cambios y luego usa el botón de abajo.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleRegisterResult}
                            disabled={!canRegisterResult}
                            fullWidth
                        >
                            Registrar resultado
                        </Button>
                        {!canRegisterResult && (
                            <p className="text-xs text-neutral-medium mt-2">
                                El partido debe estar en estado "Jugado", "W.O." o "Suspendido"
                                para registrar el resultado.
                            </p>
                        )}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            fullWidth
                            className="order-1 sm:order-1"
                        >
                            Guardar cambios
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            fullWidth
                            className="order-2 sm:order-2"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EditMatch