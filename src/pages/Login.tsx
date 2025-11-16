import { AuthLayout } from "../layouts/AuthLayout"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Input from "../components/UI/Input"
import Button from "../components/UI/Button"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/authService"

const schema = yup.object({
    email: yup
        .string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria'),
})
type LoginFormData = yup.InferType<typeof schema>

export const Login = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await login(data.email, data.password)
            if (result.success) {
                navigate('/dashboard')
            } else {
                setError('password', {
                    type: 'manual',
                    message: result.error || 'Error al iniciar sesión',
                })
            }
            // const userHasActiveAccess = false
            // if (!userHasActiveAccess) {
            //     navigate('/activate')
            // } else {
            //     navigate('/dashboard')
            // }
        } catch (error) {
            console.error('Error during login:', error)
            setError('password', {
                type: 'manual',
                message: 'Email o contraseña incorrectos',
            })
        }
    }

    return (
        <AuthLayout
            title="Iniciar sesión"
            subtitle="Accede a tu cuenta de Cancha360"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Ingresa tu contraseña"
                />
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-accent hover:text-accent-dark font-medium"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <div className="pt-2">
                    <Button type="submit" fullWidth isLoading={isSubmitting}>
                        Iniciar sesión
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-neutral-medium">
                        ¿No tienes cuenta?{' '}
                        <Link
                            to="/signup"
                            className="text-accent hover:text-accent-dark font-medium"
                        >
                            Crear una cuenta
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}
