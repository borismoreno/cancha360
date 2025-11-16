import { useNavigate } from 'react-router-dom'
import { AlertCircleIcon } from 'lucide-react'
import Button from '../components/UI/Button'
const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center">
                            <AlertCircleIcon className="text-brand" size={48} />
                        </div>
                    </div>
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-neutral-dark mb-3">
                        Página no encontrada
                    </h1>
                    {/* Subtitle */}
                    <p className="text-neutral-medium mb-8">
                        Lo sentimos, no pudimos encontrar la página que estás buscando.
                    </p>
                    {/* Primary Button */}
                    <div className="mb-4">
                        <Button fullWidth onClick={() => navigate('/dashboard')}>
                            Volver al inicio
                        </Button>
                    </div>
                    {/* Secondary Link */}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-accent hover:text-accent-dark font-medium transition-colors"
                    >
                        Ir a la página de inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    )
}
export default NotFound
