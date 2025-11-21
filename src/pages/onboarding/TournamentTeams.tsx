import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { XIcon } from 'lucide-react'
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"
import OnboardingListLayout from "../../layouts/OnboardingListLayout"

const schema = yup.object({
    teamName: yup.string().required('El nombre del equipo no puede estar vacío'),
})
type TeamFormData = yup.InferType<typeof schema>

const TournamentTeams = () => {
    const navigate = useNavigate()
    const [teams, setTeams] = useState<string[]>([])
    const [maxNumberTeams, setMaxNumberTeams] = useState<number>(2);
    const [duplicateError, setDuplicateError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<TeamFormData>({
        resolver: yupResolver(schema),
    })

    const onAddTeam = (data: TeamFormData) => {
        if (teams.includes(data.teamName.trim())) {
            setError('teamName', {
                type: 'manual',
                message: 'Este equipo ya fue agregado',
            })
            return
        }
        setTeams([...teams, data.teamName.trim()])
        reset()
        setDuplicateError('')
    }

    const handleRemoveTeam = (index: number) => {
        setTeams(teams.filter((_, i) => i !== index))
    }

    const handleContinue = () => {
        if (teams.length !== maxNumberTeams) {
            setDuplicateError(`Debes agregar ${maxNumberTeams} equipos`)
            return
        }
        localStorage.setItem('tournamentTeams', JSON.stringify(teams))
        navigate('/onboarding/campeonato/fixture')
    }

    const handleBack = () => {
        localStorage.setItem('tournamentTeams', JSON.stringify(teams))
        navigate('/onboarding/campeonato/reglas')
    }

    useEffect(() => {
        const data = localStorage.getItem('tournamentData')
        if (data) {
            const datos = JSON.parse(data)
            setMaxNumberTeams(datos.numberOfTeams)
        }

        const teamsData = localStorage.getItem('tournamentTeams')
        if (teamsData) {
            const datos = JSON.parse(teamsData)
            setTeams(datos)
        }
    }, [])

    const sidebarContent = (
        <>
            <div className="bg-white rounded-lg border border-neutral-medium p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-dark mb-2">
                    Agregar equipo
                </h3>
                <p className="text-sm text-neutral-medium mb-4">
                    Ingresa el nombre del equipo y agrégalo a la lista.
                </p>
                <form onSubmit={handleSubmit(onAddTeam)} className="space-y-4">
                    <Input
                        label="Nombre del equipo"
                        id="teamName"
                        name="teamName"
                        register={register('teamName')}
                        placeholder="Ej: Los Tigres"
                        error={errors.teamName?.message}
                    />
                    <Button type="submit" fullWidth variant="secondary">
                        Agregar equipo
                    </Button>
                </form>
            </div>
            {duplicateError && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">{duplicateError}</p>
                </div>
            )}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    {`Debes agregar ${maxNumberTeams} equipos para continuar. Podrás editar la
                    información de los equipos más adelante.`}
                </p>
            </div>
        </>
    )

    const mainContent = (
        <div className="bg-white rounded-lg border border-neutral-medium shadow-md overflow-hidden">
            <div className="bg-neutral-light border-b border-neutral-medium px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-dark">
                    Equipos agregados
                </h2>
                <p className="text-sm text-neutral-medium mt-1">
                    {teams.length} {teams.length === 1 ? 'equipo' : 'equipos'}
                </p>
            </div>
            <div className="overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-300px)]">
                {teams.length > 0 ? (
                    <div className="p-6">
                        <ul className="space-y-3">
                            {teams.map((team, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-neutral-light p-4 rounded-lg border border-neutral-medium hover:border-brand transition-colors"
                                >
                                    <span className="font-medium text-neutral-dark">{team}</span>
                                    <button
                                        onClick={() => handleRemoveTeam(index)}
                                        className="text-state-wo hover:text-[#B91C1C] transition-colors p-2"
                                        aria-label="Eliminar equipo"
                                    >
                                        <XIcon size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="text-neutral-medium mb-3">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-neutral-medium">No hay equipos agregados aún</p>
                        <p className="text-sm text-neutral-medium mt-1">
                            Usa el formulario para agregar equipos
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
    const actions = (
        <>
            <Button onClick={handleContinue} fullWidth disabled={teams.length < 2}>
                Continuar
            </Button>
            <Button onClick={handleBack} fullWidth variant="secondary">
                Regresar
            </Button>
        </>
    )

    return (
        <OnboardingListLayout
            title="Equipos participantes"
            subtitle="Agrega los equipos que participarán en tu campeonato."
            sidebarContent={sidebarContent}
            mainContent={mainContent}
            actions={actions}
        />
    )
}

export default TournamentTeams