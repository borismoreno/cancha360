import { useStandings } from "../../hooks/useStandings"
import { useAppSelector } from "../../hooks/reducer"
import Loading from "../../components/UI/Loading";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from 'lucide-react'
import Button from "../../components/UI/Button";

const StandingsTable = () => {
    const navigate = useNavigate()
    const { tournament: tournamentData } = useAppSelector(state => state.tournament);
    const { loading, standings } = useStandings(tournamentData?.id!)

    if (loading) return <Loading fullScreen />
    return (
        <div className="min-h-screen bg-neutral-light">
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
                            Tabla de Posiciones
                        </h1>
                        <p className="text-sm text-neutral-medium mt-1">
                            Resumen actualizado automáticamente en base a resultados.
                        </p>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Tournament Info Card */}
                {tournamentData && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-neutral-medium">Campeonato: </span>
                                <span className="font-semibold text-neutral-dark">
                                    {tournamentData.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-medium">Categoría: </span>
                                <span className="font-semibold text-neutral-dark">
                                    {tournamentData.category}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-medium">Temporada: </span>
                                <span className="font-semibold text-neutral-dark">
                                    {tournamentData.season}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {/* Standings Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-light border-b-2 border-neutral-medium">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        Pos
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        Equipo
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        PJ
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        PG
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        PE
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        PP
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        GF
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        GC
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                                        DG
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-dark uppercase tracking-wider bg-brand/10">
                                        Pts
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-medium">
                                {standings.map((team, index) => (
                                    <tr
                                        key={team.position}
                                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-light/50'} hover:bg-neutral-light transition-colors ${team.position === 1 ? 'bg-brand/5' : ''}`}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full ${team.position === 1 ? 'bg-brand text-white font-bold' : 'bg-neutral-light text-neutral-dark font-semibold'}`}
                                            >
                                                {team.position}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                                className={`font-semibold ${team.position === 1 ? 'text-brand' : 'text-neutral-dark'}`}
                                            >
                                                {team.team_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.played}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.won}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.drawn}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.lost}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.goals_for}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-neutral-dark">
                                            {team.goals_against}
                                        </td>
                                        <td
                                            className={`px-4 py-3 text-center text-sm font-semibold ${team.goal_difference > 0 ? 'text-green-600' : team.goal_difference < 0 ? 'text-red-600' : 'text-neutral-dark'}`}
                                        >
                                            {team.goal_difference > 0 ? '+' : ''}
                                            {team.goal_difference}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-brand/10 text-brand">
                                                {team.points}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Legend */}
                <div className="bg-white rounded-lg shadow-md p-4 mt-6">
                    <h3 className="text-sm font-semibold text-neutral-dark mb-3">
                        Leyenda
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs text-neutral-medium">
                        <div>
                            <span className="font-semibold">PJ:</span> Partidos Jugados
                        </div>
                        <div>
                            <span className="font-semibold">PG:</span> Partidos Ganados
                        </div>
                        <div>
                            <span className="font-semibold">PE:</span> Empates
                        </div>
                        <div>
                            <span className="font-semibold">PP:</span> Perdidos
                        </div>
                        <div>
                            <span className="font-semibold">GF:</span> Goles a Favor
                        </div>
                        <div>
                            <span className="font-semibold">GC:</span> Goles en Contra
                        </div>
                        <div>
                            <span className="font-semibold">DG:</span> Diferencia de Goles
                        </div>
                        <div>
                            <span className="font-semibold">Pts:</span> Puntos
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/partidos/${tournamentData?.id!}`)}
                        fullWidth
                    >
                        Ver partidos
                    </Button>
                    <Button variant="secondary" fullWidth>
                        Ver equipos
                    </Button>
                </div>
                {/* Back Button */}
                <div className="mt-6">
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

export default StandingsTable