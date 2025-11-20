import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthLayout } from '../../layouts/AuthLayout'
import Button from '../../components/UI/Button'

interface Match {
    team1: string
    team2: string
}
interface Matchday {
    number: number
    matches: Match[]
}
const schema = yup.object({
    roundType: yup
        .string()
        .oneOf(['single', 'double'])
        .required('Debes seleccionar un formato'),
})
type FormValues = yup.InferType<typeof schema>

const TournamentFixture = () => {
    const navigate = useNavigate()
    const [matchdays, setMatchdays] = useState<Matchday[]>([])
    const { register, watch } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            roundType: 'single',
        },
    })
    const roundType = watch('roundType')
    useEffect(() => {
        // Get teams from localStorage
        const teamsData = localStorage.getItem('tournamentTeams')
        const teams = teamsData
            ? JSON.parse(teamsData)
            : ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D']
        // Generate fixture based on selected round type
        const generatedMatchdays = generateRoundRobin(
            teams,
            roundType as 'single' | 'double',
        )
        setMatchdays(generatedMatchdays)
    }, [roundType])
    const generateRoundRobin = (
        teams: string[],
        type: 'single' | 'double',
    ): Matchday[] => {
        const matchdays: Matchday[] = []
        const teamsCopy = [...teams]
        // If odd number of teams, add a "BYE" team
        if (teamsCopy.length % 2 !== 0) {
            teamsCopy.push('Descanso')
        }
        const numTeams = teamsCopy.length
        const numRounds = numTeams - 1
        // Generate first round (or only round for single)
        for (let round = 0; round < numRounds; round++) {
            const matches: Match[] = []
            for (let i = 0; i < numTeams / 2; i++) {
                const team1 = teamsCopy[i]
                const team2 = teamsCopy[numTeams - 1 - i]
                if (team1 !== 'Descanso' && team2 !== 'Descanso') {
                    matches.push({
                        team1,
                        team2,
                    })
                }
            }
            matchdays.push({
                number: round + 1,
                matches,
            })
            // Rotate teams for next round (keep first team fixed)
            const lastTeam = teamsCopy.pop()!
            teamsCopy.splice(1, 0, lastTeam)
        }
        // If double round, add return matches
        if (type === 'double') {
            const returnMatchdays: Matchday[] = []
            const firstRoundLength = matchdays.length
            matchdays.forEach((matchday, index) => {
                const returnMatches: Match[] = matchday.matches.map((match) => ({
                    team1: match.team2,
                    team2: match.team1,
                }))
                returnMatchdays.push({
                    number: firstRoundLength + index + 1,
                    matches: returnMatches,
                })
            })
            return [...matchdays, ...returnMatchdays]
        }
        return matchdays
    }
    const handleFinish = () => {
        // Clear localStorage
        localStorage.removeItem('tournamentTeams')
        // Keep tournamentData for the dashboard
        // In a real app, this would save to database
        navigate('/dashboard')
    }
    const handleBack = () => {
        navigate('/onboarding/campeonato/equipos')
    }
    return (
        <AuthLayout
            title="Calendario del campeonato"
            subtitle="Configura el formato y revisa el fixture generado"
        >
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Round Type Selection */}
                <div className="bg-white rounded-lg border border-neutral-medium p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-neutral-dark mb-2">
                        Formato del campeonato
                    </h3>
                    <p className="text-sm text-neutral-medium mb-4">
                        Selecciona si deseas jugar una sola vuelta o ida y vuelta.
                    </p>
                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="single"
                                {...register('roundType')}
                                className="w-4 h-4 text-brand border-neutral-medium focus:ring-brand focus:ring-2"
                            />
                            <span className="ml-3 text-sm text-neutral-dark">
                                Una vuelta (todos contra todos 1 vez)
                            </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="double"
                                {...register('roundType')}
                                className="w-4 h-4 text-brand border-neutral-medium focus:ring-brand focus:ring-2"
                            />
                            <span className="ml-3 text-sm text-neutral-dark">
                                Ida y vuelta (cada enfrentamiento se juega 2 veces)
                            </span>
                        </label>
                    </div>
                </div>
                {/* Info Banner */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                        Vista previa del fixture. Podrás asignar fechas y horarios más
                        adelante desde el panel de administración.
                    </p>
                </div>
                {/* Fixture Preview Container - Scrollable on Desktop */}
                <div className="bg-white rounded-lg border border-neutral-medium shadow-md overflow-hidden">
                    <div className="bg-neutral-light border-b border-neutral-medium px-6 py-4">
                        <h2 className="text-lg font-semibold text-neutral-dark">
                            Vista previa del fixture
                        </h2>
                        <p className="text-sm text-neutral-medium mt-1">
                            {matchdays.length}{' '}
                            {matchdays.length === 1 ? 'jornada' : 'jornadas'} generadas
                        </p>
                    </div>
                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto max-h-[500px] md:max-h-[70vh]">
                        <div className="p-6">
                            <div className="space-y-6">
                                {matchdays.map((matchday) => (
                                    <div
                                        key={matchday.number}
                                        className="bg-neutral-light rounded-lg p-5 border border-neutral-medium"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-6 bg-brand rounded-full"></div>
                                            <h3 className="text-base font-semibold text-neutral-dark">
                                                Jornada {matchday.number}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {matchday.matches.map((match, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white p-4 rounded-lg border border-neutral-medium hover:border-brand transition-colors"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="font-medium text-neutral-dark flex-1 text-sm md:text-base">
                                                            {match.team1}
                                                        </span>
                                                        <span className="text-neutral-medium font-semibold text-xs md:text-sm px-3 py-1 bg-neutral-light rounded-full">
                                                            VS
                                                        </span>
                                                        <span className="font-medium text-neutral-dark flex-1 text-right text-sm md:text-base">
                                                            {match.team2}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                    <Button onClick={handleFinish} fullWidth>
                        Finalizar configuración
                    </Button>
                    <Button onClick={handleBack} fullWidth variant="secondary">
                        Regresar
                    </Button>
                </div>
            </div>
        </AuthLayout>
    )
}

export default TournamentFixture