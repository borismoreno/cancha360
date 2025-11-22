import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '../../components/UI/Button'
import OnboardingListLayout from '../../layouts/OnboardingListLayout'
import { showToast } from '../../utils/toast'
import { tournamentService, type FixturePayload } from '../../services/tournamentService'
import { useAuth } from '../../context/AuthContext'

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
    const { restoreSession } = useAuth()
    const navigate = useNavigate()
    const [matchdays, setMatchdays] = useState<Matchday[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const { register, watch } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            roundType: 'single',
        },
    })
    const roundType = watch('roundType')
    useEffect(() => {
        const teamsData = localStorage.getItem('tournamentTeams')
        const teams = teamsData
            ? JSON.parse(teamsData)
            : ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D']
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
        if (teamsCopy.length % 2 !== 0) {
            teamsCopy.push('Descanso')
        }
        const numTeams = teamsCopy.length
        const numRounds = numTeams - 1
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
            const lastTeam = teamsCopy.pop()!
            teamsCopy.splice(1, 0, lastTeam)
        }
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
    const handleFinish = async () => {
        try {
            setLoading(true)
            const tournamentData = localStorage.getItem('tournamentData')
            const tournamentTeams = localStorage.getItem('tournamentTeams')
            if (!tournamentData || !tournamentTeams) {
                showToast('Debes ingresar la información del campeonato y los equipos', 'error')
                return;
            }
            const tournament = JSON.parse(tournamentData)
            const teams = JSON.parse(tournamentTeams)
            const tournamentPayload: FixturePayload = {
                name: tournament.name,
                category: tournament.category,
                season: tournament.season,
                teamCount: Number(tournament.numberOfTeams),
                tentativeStartDate: tournament.startDate ? tournament.startDate : null,
                formatType: roundType,
                teams: teams,
                rounds: matchdays.map((matchday) => ({
                    roundNumber: matchday.number,
                    matches: matchday.matches.map((match) => ({
                        local: match.team1,
                        visitor: match.team2,
                    })),
                })),
            }
            const response = await tournamentService.saveTournamentFull(tournamentPayload)
            if (response) {
                showToast('¡Torneo creado exitosamente!', 'success')
                localStorage.removeItem('tournamentTeams')
                localStorage.removeItem('tournamentData')
                await restoreSession()
            }
        } catch (error) {
            console.log(error)
            showToast('Ocurrió un error al guardar la configuración', 'error')
        } finally {
            setLoading(false)
        }
        // localStorage.removeItem('tournamentTeams')
        // navigate('/dashboard')
    }
    const handleBack = () => {
        navigate('/onboarding/campeonato/equipos')
    }
    const sidebarContent = (
        <>
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
                            className="w-4 h-4 text-brand border-neutral-medium"
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
                            className="w-4 h-4 text-brand border-neutral-medium"
                        />
                        <span className="ml-3 text-sm text-neutral-dark">
                            Ida y vuelta (cada enfrentamiento se juega 2 veces)
                        </span>
                    </label>
                </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    Vista previa del fixture. Podrás asignar fechas y horarios más
                    adelante desde el panel de administración.
                </p>
            </div>
        </>
    )
    const mainContent = (
        <div className="bg-white rounded-lg border border-neutral-medium shadow-md overflow-hidden">
            <div className="bg-neutral-light border-b border-neutral-medium px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-dark">
                    Vista previa del fixture
                </h2>
                <p className="text-sm text-neutral-medium mt-1">
                    {matchdays.length} {matchdays.length === 1 ? 'jornada' : 'jornadas'}{' '}
                    generadas
                </p>
            </div>
            <div className="overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-300px)]">
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
    )
    const actions = (
        <>
            <Button onClick={handleFinish} fullWidth isLoading={loading}>
                Finalizar configuración
            </Button>
            <Button onClick={handleBack} fullWidth variant="secondary">
                Regresar
            </Button>
        </>
    )
    return (
        <OnboardingListLayout
            title="Calendario del campeonato"
            subtitle="Configura el formato y revisa el fixture generado"
            sidebarContent={sidebarContent}
            mainContent={mainContent}
            actions={actions}
        />
    )
}
export default TournamentFixture
