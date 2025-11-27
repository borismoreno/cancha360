import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/UI/Button'

import {
    CalendarIcon,
    UsersIcon,
    TrophyIcon,
    SettingsIcon,
    ExternalLinkIcon,
} from 'lucide-react'
import { type Tournament, tournamentService } from '../../services/tournamentService'
import { showToast } from '../../utils/toast'
import Loading from '../../components/UI/Loading'
import { useAppDispatch } from '../../hooks/reducer'
import { setTournament } from '../../reducers/tournamentSlice'
import ButtonSalir from '../../components/UI/ButtonSalir'

const Dashboard = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const [tournamentData, setTournamentData] = useState<Tournament>()
    const [loading, setLoading] = useState<boolean>(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await tournamentService.getMyTournaments()
            if (response && response.length > 0) {
                dispatch(setTournament({
                    id: response[0].id,
                    name: response[0].name,
                    category: response[0].category ?? '',
                    season: response[0].season ?? ''
                }))
                setTournamentData(response[0])
            }
        } catch (error) {
            showToast('Ocurrió un error al cargar los datos del campeonato.', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (!tournamentData) return <Loading fullScreen />

    return (
        <div className="min-h-screen bg-neutral-light">
            {loading && <Loading fullScreen />}
            {/* Header / Navbar */}
            <header className="bg-white border-b border-neutral-medium">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-brand">Cancha360</h1>
                            <p className="text-sm text-neutral-medium mt-1">
                                {tournamentData.name}
                            </p>
                        </div>
                        <ButtonSalir />
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Tournament Summary Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-6">
                        Resumen del Campeonato
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-neutral-medium mb-1">Nombre</p>
                            <p className="text-base font-semibold text-neutral-dark">
                                {tournamentData.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-medium mb-1">Categoría</p>
                            <p className="text-base font-semibold text-neutral-dark">
                                {tournamentData.category}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-medium mb-1">Temporada</p>
                            <p className="text-base font-semibold text-neutral-dark">
                                {tournamentData.season}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-medium mb-1">Equipos</p>
                            <p className="text-base font-semibold text-neutral-dark">
                                {tournamentData.team_count} equipos
                                {/* 6 equipos */}
                            </p>
                        </div>
                        {tournamentData.tentative_start_date && (
                            <div>
                                <p className="text-sm text-neutral-medium mb-1">
                                    Fecha de inicio
                                </p>
                                <p className="text-base font-semibold text-neutral-dark">
                                    {new Date(tournamentData.tentative_start_date).toLocaleDateString(
                                        'es-ES',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-neutral-medium mb-1">
                                Próxima jornada
                            </p>
                            <p className="text-base font-semibold text-neutral-dark">
                                Jornada 1 - Por programar
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-medium">
                        <Button
                            variant="secondary"
                            className="flex items-center justify-center gap-2"
                        >
                            <ExternalLinkIcon size={18} />
                            Ver link público
                        </Button>
                    </div>
                </div>
                {/* Quick Access Cards */}
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                    Módulos principales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Partidos Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-lg mb-4">
                            <CalendarIcon className="text-brand" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-dark mb-2">
                            Partidos
                        </h4>
                        <p className="text-sm text-neutral-medium mb-4">
                            Administra fechas, horarios y resultados.
                        </p>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate(`/partidos/${tournamentData.id}`)}
                        >
                            Ver partidos
                        </Button>
                    </div>
                    {/* Equipos Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-lg mb-4">
                            <UsersIcon className="text-brand" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-dark mb-2">
                            Equipos
                        </h4>
                        <p className="text-sm text-neutral-medium mb-4">
                            Consulta y administra los equipos participantes.
                        </p>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/equipos')}
                        >
                            Ver equipos
                        </Button>
                    </div>
                    {/* Tabla de posiciones Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-lg mb-4">
                            <TrophyIcon className="text-brand" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-dark mb-2">
                            Tabla de posiciones
                        </h4>
                        <p className="text-sm text-neutral-medium mb-4">
                            Resumen actualizado automáticamente.
                        </p>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/tabla-de-posiciones')}
                        >
                            Ver tabla
                        </Button>
                    </div>
                    {/* Configuración Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-lg mb-4">
                            <SettingsIcon className="text-brand" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-dark mb-2">
                            Configuración
                        </h4>
                        <p className="text-sm text-neutral-medium mb-4">
                            Cambia nombre, categoría o detalles.
                        </p>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/configuracion')}
                        >
                            Ajustar configuración
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard