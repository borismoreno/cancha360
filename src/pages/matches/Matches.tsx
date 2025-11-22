import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { roundService, type RoundWithMatches } from "../../services/roundService"
import { showToast } from "../../utils/toast"
import Loading from "../../components/UI/Loading"
import { useParams } from "react-router-dom"
import Button from "../../components/UI/Button"
import { ArrowLeftIcon, SearchIcon } from 'lucide-react'
import { useAppDispatch } from "../../hooks/reducer"
import { setEditingMatch } from "../../reducers/matchSlice"
import type { MatchWithTeams } from "../../services/matchService"

const Matches = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { tournamentId } = useParams()
    const [matchdays, setMatchdays] = useState<RoundWithMatches[]>()
    const [selectedMatchday, setSelectedMatchday] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await roundService.getRoundsByTournament(tournamentId!)
            if (response) setMatchdays(response)
        } catch (error) {
            showToast('Ocurrió un error al cargar las jornadas', 'error')
        } finally {
            setLoading(false)
        }
    }

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

    const filteredMatchdays = matchdays?.map((matchday) => ({
        ...matchday,
        matches: matchday.matches.filter(
            (match) =>
                match.local_team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                match.visitor_team?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    }))

    const currentMatchday = filteredMatchdays?.find(
        (md) => md.round_number === selectedMatchday,
    )
    return (
        <div className="min-h-screen bg-neutral-light">
            {loading && <Loading fullScreen />}
            {/* Header */}
            <header className="bg-white border-b border-neutral-medium">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-neutral-medium hover:text-neutral-dark transition-colors mb-4"
                    >
                        <ArrowLeftIcon size={20} />
                        <span className="text-sm font-medium">Regresar al dashboard</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-dark">
                            Partidos del Campeonato
                        </h1>
                        <p className="text-sm text-neutral-medium mt-1">
                            Administra fechas, horarios, estados y resultados.
                        </p>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <SearchIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Buscar equipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                </div>
                {/* Matchday Selector */}
                <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-semibold text-neutral-dark mb-3">
                        Seleccionar Jornada
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {matchdays && matchdays.map((matchday) => (
                            <button
                                key={matchday.round_number}
                                onClick={() => setSelectedMatchday(matchday.round_number)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${selectedMatchday === matchday.round_number ? 'bg-brand text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium hover:text-white'}`}
                            >
                                Jornada {matchday.round_number}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Matches List */}
                {currentMatchday && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-neutral-dark">
                            Jornada {currentMatchday.round_number}
                        </h2>
                        {currentMatchday.matches.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-neutral-medium">
                                    No se encontraron partidos para esta búsqueda.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {currentMatchday.matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            {/* Teams */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between sm:justify-start gap-4">
                                                    <span className="font-semibold text-neutral-dark flex-1 sm:flex-none">
                                                        {match.local_team?.name}
                                                    </span>
                                                    <span className="text-neutral-medium font-medium">
                                                        VS
                                                    </span>
                                                    <span className="font-semibold text-neutral-dark flex-1 sm:flex-none text-right sm:text-left">
                                                        {match.visitor_team?.name}
                                                    </span>
                                                </div>
                                                {/* Date and Time */}
                                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-medium">
                                                    {match.scheduled_date ? (
                                                        <span>📅 {match.scheduled_date}</span>
                                                    ) : (
                                                        <span>📅 Fecha por asignar</span>
                                                    )}
                                                    {match.scheduled_time ? (
                                                        <span>🕐 {match.scheduled_time}</span>
                                                    ) : (
                                                        <span>🕐 Hora por asignar</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Status and Actions */}
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                <div className="flex justify-center">
                                                    {getStatusBadge(match.status)}
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        dispatch(setEditingMatch(match))
                                                        navigate(`/partidos/editar/${match.id}`)
                                                    }}
                                                    className="whitespace-nowrap"
                                                >
                                                    Editar partido
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* Back Button */}
                <div className="mt-8">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/dashboard')}
                        fullWidth
                    >
                        Regresar al dashboard
                    </Button>
                </div>
            </main>
        </div>
    )
}

export default Matches
