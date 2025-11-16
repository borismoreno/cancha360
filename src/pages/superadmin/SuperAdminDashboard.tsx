import { useEffect, useState } from 'react'
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom'
import {
    KeyIcon,
    UsersIcon,
    TrophyIcon,
    ShieldCheckIcon,
    LogOutIcon,
} from 'lucide-react'
import Button from '../../components/UI/Button'

interface Stats {
    totalOrganizers: number
    activeTournaments: number
    codesGenerated: number
    codesUsed: number
}

export const SuperAdminDashboard = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [stats, setStats] = useState<Stats>({
        totalOrganizers: 0,
        activeTournaments: 0,
        codesGenerated: 0,
        codesUsed: 0,
    })

    useEffect(() => {
        // Load demo stats
        const codes = JSON.parse(localStorage.getItem('accessCodes') || '[]')
        const organizers = JSON.parse(localStorage.getItem('organizers') || '[]')
        const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
        setStats({
            totalOrganizers: organizers.length || 12,
            activeTournaments: tournaments.length || 34,
            codesGenerated: codes.length || 50,
            codesUsed: codes.filter((c: any) => c.used).length || 28,
        })
    }, [])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
                                <ShieldCheckIcon className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Panel Superadmin
                                </h1>
                                <p className="text-xs text-gray-500">Cancha360</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <LogOutIcon size={20} />
                            <span className="text-sm font-medium">Salir</span>
                        </button>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Panel Superadmin</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Administración del sistema y control de organizadores y activaciones
                    </p>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Organizadores */}
                    <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                <UsersIcon className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalOrganizers}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">Total de Organizadores</p>
                        <Button
                            variant="secondary"
                            className="text-xs py-2 px-3"
                            onClick={() => navigate('/superadmin/organizadores')}
                        >
                            Ver detalles
                        </Button>
                    </div>
                    {/* Campeonatos Activos */}
                    <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                                <TrophyIcon className="text-green-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.activeTournaments}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">Campeonatos Activos</p>
                        <Button
                            variant="secondary"
                            className="text-xs py-2 px-3"
                            onClick={() => navigate('/superadmin/campeonatos')}
                        >
                            Ver detalles
                        </Button>
                    </div>
                    {/* Códigos Generados */}
                    <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                                <KeyIcon className="text-purple-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.codesGenerated}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">Códigos Generados</p>
                        <Button
                            variant="secondary"
                            className="text-xs py-2 px-3"
                            onClick={() => navigate('/superadmin/codigos')}
                        >
                            Ver detalles
                        </Button>
                    </div>
                    {/* Códigos Usados */}
                    <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                                <KeyIcon className="text-amber-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.codesUsed}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">Códigos Usados</p>
                        <Button
                            variant="secondary"
                            className="text-xs py-2 px-3"
                            onClick={() => navigate('/superadmin/codigos?filter=used')}
                        >
                            Ver detalles
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
