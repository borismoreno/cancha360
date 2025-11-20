import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { XIcon } from 'lucide-react'
import { AuthLayout } from "../../layouts/AuthLayout"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"

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

    return (
        <AuthLayout
            title="Equipos participantes"
            subtitle="Agrega los equipos que participarán en tu campeonato."
        >
            <div className="space-y-6">
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
                {duplicateError && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">{duplicateError}</p>
                    </div>
                )}
                {teams.length > 0 && (
                    <div className="bg-white rounded-lg border border-neutral-medium p-4">
                        <h3 className="text-sm font-semibold text-neutral-dark mb-3">
                            Equipos agregados ({teams.length})
                        </h3>
                        <ul className="space-y-2">
                            {teams.map((team, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-neutral-light p-3 rounded-lg"
                                >
                                    <span className="text-sm text-neutral-dark">{team}</span>
                                    <button
                                        onClick={() => handleRemoveTeam(index)}
                                        className="text-state-wo hover:text-[#B91C1C] transition-colors"
                                        aria-label="Eliminar equipo"
                                    >
                                        <XIcon size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="pt-2 space-y-3">
                    <Button
                        onClick={handleContinue}
                        fullWidth
                        disabled={teams.length !== maxNumberTeams}
                    >
                        Continuar
                    </Button>
                    <Button onClick={handleBack} fullWidth variant="secondary">
                        Regresar
                    </Button>
                </div>
            </div>
        </AuthLayout>
    )
}

export default TournamentTeams