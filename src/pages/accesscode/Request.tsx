import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthLayout } from '../../layouts/AuthLayout'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import { accessCodeRequestService } from '../../services/accessCodeRequestService'
import Loading from '../../components/UI/Loading'

const schema = yup.object({
    phone: yup
        .string()
        .required('El teléfono es obligatorio')
        .matches(
            /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
            'Ingresa un número de teléfono válido',
        )
        .min(8, 'El teléfono debe tener al menos 8 dígitos')
        .max(20, 'El teléfono no puede tener más de 20 caracteres'),
    organizationName: yup.string().default(''),
})
type RequestFormData = yup.InferType<typeof schema>

const Request = () => {
    const { profile } = useAuth();
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RequestFormData>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: RequestFormData) => {
        try {
            setLoading(true)
            setSubmittedEmail(profile?.email!)
            const response = await accessCodeRequestService.create({
                phone: data.phone,
                organization_name: data.organizationName ?? null
            })
            if (response) setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting request:', error)
        } finally {
            setLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <AuthLayout
                title="¡Solicitud enviada!"
                subtitle="Gracias por tu interés en Cancha360"
            >
                <div className="space-y-4">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <p className="text-brand-dark text-sm mb-4">
                            Hemos recibido tu solicitud correctamente. Te enviaremos un código
                            de acceso a <strong>{submittedEmail}</strong> en las próximas
                            24-48 horas.
                        </p>
                        <p className="text-brand-dark text-sm">
                            Mientras tanto, revisa tu bandeja de entrada y spam para no
                            perderte nuestro mensaje.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link to="/activacion">
                            <Button fullWidth>Ir a activar código</Button>
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-sm text-accent hover:text-accent-dark font-medium"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Solicitar código de acceso"
            subtitle="Cancha360 está en fase beta privada. Solicita un código de acceso para activar tu primer campeonato."
        >
            {loading && <Loading fullScreen />}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Teléfono"
                    type="tel"
                    id="phone"
                    name="phone"
                    register={register('phone')}
                    required
                    error={errors.phone?.message}
                    placeholder="+54 11 1234-5678"
                />
                <Input
                    label="Nombre de la liga u organización"
                    id="organizationName"
                    name="organizationName"
                    register={register('organizationName')}
                    placeholder="Opcional"
                />
                <div className="pt-2">
                    <Button type="submit" fullWidth isLoading={isSubmitting}>
                        Solicitar código
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-neutral-medium">
                        ¿Ya tienes un código?{' '}
                        <Link
                            to="/activacion"
                            className="text-accent hover:text-accent-dark font-medium"
                        >
                            Actívalo aquí
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Request