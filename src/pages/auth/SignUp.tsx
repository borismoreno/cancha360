import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AuthLayout } from '../../layouts/AuthLayout'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import { registerOrganizer } from '../../services/authService'
import { showToast } from '../../utils/toast'
import { useAuth } from '../../context/AuthContext'

const schema = yup.object({
    fullName: yup.string().required('El nombre es obligatorio'),
    email: yup
        .string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: yup
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    organizationName: yup.string().default(''),
})
type SignUpFormData = yup.InferType<typeof schema>

export const SignUp = () => {
    const { restoreSession } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
    })
    const onSubmit = async (data: SignUpFormData) => {
        try {
            const { success, message } = await registerOrganizer({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                organizationName: data.organizationName ?? null,
            });
            if (success) {
                showToast('¡Cuenta creada exitosamente!', 'success')
                await restoreSession()
            } else {
                showToast(message, 'error')
            }
        } catch (error) {
            console.error('Error during sign up:', error)
        }
    }

    return (
        <AuthLayout
            title="Crear cuenta"
            subtitle="Regístrate para administrar tus campeonatos de fútbol"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nombre completo"
                    id="fullName"
                    name="fullName"
                    register={register('fullName')}
                    required
                    error={errors.fullName?.message}
                    placeholder="Ingresa tu nombre completo"
                />
                <Input
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    register={register('email')}
                    required
                    error={errors.email?.message}
                    placeholder="tu@email.com"
                />
                <Input
                    label="Contraseña"
                    type="password"
                    id="password"
                    name="password"
                    register={register('password')}
                    required
                    error={errors.password?.message}
                    placeholder="Mínimo 6 caracteres"
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
                        Crear cuenta
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-neutral-medium">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-accent hover:text-accent-dark font-medium"
                        >
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}