import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { matchService, type MatchWithTeams } from "../../services/matchService"
import { showToast } from "../../utils/toast"
import { ArrowLeftIcon } from 'lucide-react'
import Button from "../../components/UI/Button"
import Loading from "../../components/UI/Loading"

const RegisterResult = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = useState<MatchWithTeams>()
    const [loading, setLoading] = useState(false)
    const [team1Score, setTeam1Score] = useState(0)
    const [team2Score, setTeam2Score] = useState(0)
    const [woTeam, setWoTeam] = useState<'team1' | 'team2' | 'both'>('team1')
    const [suspensionReason, setSuspensionReason] = useState('')
    const [suspensionMinute, setSuspensionMinute] = useState('')

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await matchService.getMatchById(id!)
            setMatch(response);
        } catch (error) {
            showToast('Ocurrió un error al cargar la información del partido.', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSave = () => { }

    const handleCancel = () => {
        navigate(`/partidos/editar/${id}`)
    }

    const getStatusInfo = (status: string) => {
        const statusConfig = {
            pending: {
                label: 'Pendiente',
                color: 'bg-state-pending text-white',
                description: 'Este partido aún no ha sido jugado',
            },
            played: {
                label: 'Jugado',
                color: 'bg-state-played text-white',
                description: 'Ingresa el resultado final del partido',
            },
            wo: {
                label: 'W.O.',
                color: 'bg-state-wo text-white',
                description: 'Indica qué equipo no se presentó',
            },
            suspended: {
                label: 'Suspendido',
                color: 'bg-state-suspended text-white',
                description: 'Registra los detalles de la suspensión',
            },
        }
        return statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending
    }

    const statusInfo = getStatusInfo(match?.status ?? "pending")

    return (
        <div className="min-h-screen bg-neutral-light">
            {loading && <Loading fullScreen />}
            {/* Header */}
            <header className="bg-white border-b border-neutral-medium">
                <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(`/partidos/editar/${id}`)}
                        className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark transition-colors mb-4"
                    >
                        <ArrowLeftIcon size={20} />
                        <span className="text-sm font-medium">Volver a editar partido</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">
                            Registrar Resultado
                        </h1>
                        <p className="text-sm text-neutral-medium mt-1">
                            Ingresa el resultado final del partido o marca su estado
                            correspondiente.
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
                {/* Current Status Display */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-3">
                        Estado del partido
                    </h3>
                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}
                        >
                            {statusInfo.label}
                        </span>
                        <span className="text-sm text-neutral-medium">
                            {statusInfo.description}
                        </span>
                    </div>
                </div>
                {/* Result Type Selector */}
                {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                        Tipo de resultado
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                            <input
                                type="radio"
                                name="resultType"
                                value="normal"
                                checked={resultType === 'normal'}
                                onChange={() => setResultType('normal')}
                                className="w-4 h-4 text-brand focus:ring-brand"
                            />
                            <span className="ml-3 text-neutral-dark font-medium">
                                Resultado normal (goles)
                            </span>
                        </label>
                        <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                            <input
                                type="radio"
                                name="resultType"
                                value="wo"
                                checked={resultType === 'wo'}
                                onChange={() => setResultType('wo')}
                                className="w-4 h-4 text-brand focus:ring-brand"
                            />
                            <span className="ml-3 text-neutral-dark font-medium">W.O.</span>
                        </label>
                        <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                            <input
                                type="radio"
                                name="resultType"
                                value="suspended"
                                checked={resultType === 'suspended'}
                                onChange={() => setResultType('suspended')}
                                className="w-4 h-4 text-brand focus:ring-brand"
                            />
                            <span className="ml-3 text-neutral-dark font-medium">
                                Partido suspendido
                            </span>
                        </label>
                    </div>
                </div> */}
                {/* Dynamic Content Based on Selection */}
                {match?.status === 'played' && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                            Resultado del Partido
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="team1Score"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Goles de {match?.local_team?.name}
                                </label>
                                <input
                                    type="number"
                                    id="team1Score"
                                    min="0"
                                    value={team1Score}
                                    onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="team2Score"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Goles de {match?.visitor_team?.name}
                                </label>
                                <input
                                    type="number"
                                    id="team2Score"
                                    min="0"
                                    value={team2Score}
                                    onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                            {/* Result Preview */}
                            <div className="mt-4 p-4 bg-neutral-light rounded-lg">
                                <p className="text-sm text-neutral-medium mb-2">
                                    Vista previa del resultado:
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <span className="font-semibold text-neutral-dark text-xl">
                                        {match?.local_team?.name}
                                    </span>
                                    <span className="text-2xl font-bold text-brand">
                                        {team1Score} - {team2Score}
                                    </span>
                                    <span className="font-semibold text-neutral-dark text-xl">
                                        {match?.visitor_team?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {match?.status === 'wo' && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                            Equipo que no se presentó
                        </h3>
                        <div className="space-y-3 mb-4">
                            <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                                <input
                                    type="radio"
                                    name="woTeam"
                                    value="team1"
                                    checked={woTeam === 'team1'}
                                    onChange={() => setWoTeam('team1')}
                                    className="w-4 h-4 text-brand focus:ring-brand"
                                />
                                <span className="ml-3 text-neutral-dark">
                                    {match?.local_team?.name} no se presentó
                                </span>
                            </label>
                            <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                                <input
                                    type="radio"
                                    name="woTeam"
                                    value="team2"
                                    checked={woTeam === 'team2'}
                                    onChange={() => setWoTeam('team2')}
                                    className="w-4 h-4 text-brand focus:ring-brand"
                                />
                                <span className="ml-3 text-neutral-dark">
                                    {match?.visitor_team?.name} no se presentó
                                </span>
                            </label>
                            <label className="flex items-center p-4 border-2 border-neutral-medium rounded-lg cursor-pointer hover:border-brand transition-colors">
                                <input
                                    type="radio"
                                    name="woTeam"
                                    value="both"
                                    checked={woTeam === 'both'}
                                    onChange={() => setWoTeam('both')}
                                    className="w-4 h-4 text-brand focus:ring-brand"
                                />
                                <span className="ml-3 text-neutral-dark">
                                    Ambos equipos no se presentaron
                                </span>
                            </label>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                ℹ️ En un W.O., el equipo presente recibe automáticamente 3
                                puntos.
                            </p>
                        </div>
                    </div>
                )}
                {match?.status === 'suspended' && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                            Detalles de la suspensión
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="suspensionReason"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Motivo de la suspensión
                                </label>
                                <textarea
                                    id="suspensionReason"
                                    rows={4}
                                    value={suspensionReason}
                                    onChange={(e) => setSuspensionReason(e.target.value)}
                                    placeholder="Describe el motivo de la suspensión..."
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="suspensionMinute"
                                    className="block text-sm font-medium text-neutral-dark mb-2"
                                >
                                    Minuto jugado antes de la suspensión (opcional)
                                </label>
                                <input
                                    type="number"
                                    id="suspensionMinute"
                                    min="0"
                                    max="90"
                                    value={suspensionMinute}
                                    onChange={(e) => setSuspensionMinute(e.target.value)}
                                    placeholder="Ej: 45"
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        fullWidth
                        className="order-1 sm:order-1"
                    >
                        Guardar resultado
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
            </main>
        </div>
    )
}

export default RegisterResult
