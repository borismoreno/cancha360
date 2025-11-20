import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthLayout } from "../../layouts/AuthLayout"
import Input from "../../components/UI/Input"
import Button from "../../components/UI/Button"
import { useEffect } from "react"

const schema = yup.object({
    name: yup.string().required('El nombre del campeonato es obligatorio'),
    category: yup.string().required('La categoría es obligatoria'),
    season: yup.string().required('La temporada es obligatoria'),
    numberOfTeams: yup
        .number()
        .typeError('Debe ser un número')
        .min(2, 'Debe haber al menos 2 equipos')
        .required('El número de equipos es obligatorio'),
    startDate: yup.string().default(''),
})
type TournamentFormData = yup.InferType<typeof schema>

const TournamentData = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TournamentFormData>({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data: TournamentFormData) => {
        localStorage.setItem('tournamentData', JSON.stringify(data))
        navigate('/onboarding/campeonato/reglas')
    }

    useEffect(() => {
        const data = localStorage.getItem('tournamentData')
        if (data) {
            const datos = JSON.parse(data);
            setValue('category', datos.category)
            setValue('name', datos.name)
            setValue('numberOfTeams', datos.numberOfTeams)
            setValue('season', datos.season)
            setValue('startDate', datos.startDate)
        }
    }, [])

    return (
        <AuthLayout
            title="Configura tu campeonato"
            subtitle="Primero, define los datos principales."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nombre del campeonato"
                    id="name"
                    name="name"
                    register={register('name')}
                    required
                    error={errors.name?.message}
                    placeholder="Ej: Liga de Barrio 2024"
                />
                <Input
                    label="Categoría"
                    id="category"
                    name="category"
                    register={register('category')}
                    required
                    error={errors.category?.message}
                    placeholder="Ej: Libre, Sub-20, Veteranos"
                />
                <Input
                    label="Temporada"
                    id="season"
                    name="season"
                    register={register('season')}
                    required
                    error={errors.season?.message}
                    placeholder="Ej: 2024, Verano 2024"
                />
                <Input
                    label="Número de equipos"
                    type="number"
                    id="numberOfTeams"
                    name="numberOfTeams"
                    register={register('numberOfTeams')}
                    required
                    error={errors.numberOfTeams?.message}
                    placeholder="Mínimo 2 equipos"
                />
                <Input
                    label="Fecha tentativa de inicio"
                    type="date"
                    id="startDate"
                    name="startDate"
                    register={register('startDate')}
                    placeholder="Opcional"
                />
                <div className="pt-2 space-y-3">
                    <Button type="submit" fullWidth>
                        Continuar
                    </Button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default TournamentData