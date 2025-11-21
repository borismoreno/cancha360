import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthLayout } from "../../layouts/AuthLayout"
import { useState } from "react"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"
import { Link } from "react-router-dom"
import Loading from '../../components/UI/Loading'
import { accessCodeService } from '../../services/accessCodeService'
import { showToast } from '../../utils/toast'

const schema = yup.object({
    activationCode: yup
        .string()
        .required('Por favor ingresa un código de activación'),
})
type ActivationFormData = yup.InferType<typeof schema>

const Activate = () => {
    const { logout, restoreSession } = useAuth()
    const [loading, setLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ActivationFormData>({
        resolver: yupResolver(schema),
    })

    const handleLogout = async () => {
        await logout();
    }

    const onSubmit = async (data: ActivationFormData) => {
        try {
            setLoading(true)
            const response = await accessCodeService.validate(data.activationCode)
            if (response) {
                const res = await accessCodeService.markAsUsed(response.id)
                if (res) {
                    await restoreSession()
                    showToast('¡Código activado!', 'success')
                }
            } else {
                showToast('Código incorrecto o ya utilizado', 'error')
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    return (
        <AuthLayout
            title="Activar acceso"
            subtitle="Ingresa tu código de invitación para activar tu primer campeonato gratis"
        >
            {loading && <Loading message='Validando Código...' fullScreen />}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Código de acceso"
                    id="activationCode"
                    name="activationCode"
                    register={register('activationCode')}
                    required
                    placeholder="Ingresa tu código de activación"
                    error={errors.activationCode?.message}
                />
                <div className="pt-2">
                    <Button type="submit" fullWidth isLoading={isSubmitting}>
                        Activar acceso
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-neutral-medium">
                        ¿No tienes código?{' '}
                        <Link
                            to="/solicitar-codigo"
                            className="text-accent hover:text-accent-dark font-medium"
                        >
                            Solicitar Código
                        </Link>
                    </p>
                </div>
                <button onClick={handleLogout}>Cerrar</button>
            </form>
        </AuthLayout>
    )
}

export default Activate