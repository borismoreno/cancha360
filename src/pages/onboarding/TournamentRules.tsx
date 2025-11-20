import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import Button from '../../components/UI/Button'

const TournamentRules = () => {
    const navigate = useNavigate()
    const handleContinue = () => {
        navigate('/onboarding/campeonato/equipos')
    }
    const handleBack = () => {
        navigate('/onboarding/campeonato/datos')
    }

    return (
        <AuthLayout
            title="Reglas del torneo"
            subtitle="Estas reglas son estándar para el MVP y no se pueden modificar."
        >
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-neutral-medium p-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-dark mb-3">
                            Sistema de puntos
                        </h3>
                        <ul className="space-y-2 text-sm text-neutral-dark">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-brand rounded-full mr-3"></span>
                                Victoria = 3 puntos
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-brand rounded-full mr-3"></span>
                                Empate = 1 punto
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-brand rounded-full mr-3"></span>
                                Derrota = 0 puntos
                            </li>
                        </ul>
                    </div>
                    <div className="border-t border-neutral-medium pt-4">
                        <h3 className="text-sm font-semibold text-neutral-dark mb-3">
                            Criterios de desempate
                        </h3>
                        <ol className="space-y-2 text-sm text-neutral-dark">
                            <li className="flex items-start">
                                <span className="font-semibold mr-2">1.</span>
                                <span>Puntos totales</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold mr-2">2.</span>
                                <span>Diferencia de goles</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold mr-2">3.</span>
                                <span>Goles a favor</span>
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="pt-2 space-y-3">
                    <Button onClick={handleContinue} fullWidth>
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

export default TournamentRules