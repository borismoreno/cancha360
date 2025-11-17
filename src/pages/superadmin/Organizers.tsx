import Modal from "../../components/UI/Modal"
import Button from "../../components/UI/Button"
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { ArrowLeftIcon, SearchIcon } from 'lucide-react'
import Loading from "../../components/UI/Loading"
import { organizerService } from "../../services/organizerService"

interface Organizer {
    id: string
    name: string
    email: string
    registrationDate: string
    lastAccess: string
    tournamentsCreated: number
    status: 'active' | 'suspended'
}

const Organizers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [organizers, setOrganizers] = useState<Organizer[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'suspended'
    >('all')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
        null,
    )

    const getOrganizers = async () => {
        try {
            setLoading(true);
            const response = await organizerService.getAll();
            setOrganizers(
                (response || []).map((p) => ({
                    id: String(p.id ?? p.id ?? ''),
                    name: String(p.full_name ?? p.full_name ?? ''),
                    email: String(p.email ?? p.email ?? ''),
                    registrationDate: p.created_at,
                    lastAccess: '',
                    tournamentsCreated: 0,
                    status: p.is_active ? 'active' : 'suspended'
                }))
            )
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getOrganizers();
    }, [])

    const handleToggleStatusClick = (organizer: Organizer) => {
        setSelectedOrganizer(organizer)
        setIsModalOpen(true)
    }
    const handleConfirmToggle = async () => {
        if (!selectedOrganizer) return
        await organizerService.toggleActive(selectedOrganizer.id, selectedOrganizer.status === 'active' ? false : true)
        await getOrganizers();
        // localStorage.setItem('organizers', JSON.stringify(updatedOrganizers))
        setIsModalOpen(false)
        setSelectedOrganizer(null)
    }
    const handleCancelToggle = () => {
        setIsModalOpen(false)
        setSelectedOrganizer(null)
    }
    const filteredOrganizers = organizers.filter((organizer) => {
        const matchesSearch =
            organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            organizer.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
            statusFilter === 'all' || organizer.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate('/superadmin')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
                    >
                        <ArrowLeftIcon size={20} />
                        <span className="text-sm font-medium">Volver al panel</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Organizadores</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Consulta y administra los organizadores del sistema
                    </p>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-96">
                        <SearchIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Filtrar por estado:
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as 'all' | 'active' | 'suspended',
                                )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos</option>
                            <option value="active">Activos</option>
                            <option value="suspended">Suspendidos</option>
                        </select>
                    </div>
                </div>
                {/* Count Indicator */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredOrganizers.length} organizadores
                    </p>
                </div>
                {/* Table */}
                {loading
                    ? <Loading fullScreen />
                    :
                    (<div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha de registro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Último acceso
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Campeonatos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrganizers.map((organizer) => (
                                        <tr key={organizer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {organizer.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {organizer.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(organizer.registrationDate).toLocaleDateString(
                                                    'es-ES',
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {organizer.lastAccess
                                                    ? new Date(organizer.lastAccess).toLocaleDateString(
                                                        'es-ES',
                                                    )
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                                                    {organizer.tournamentsCreated}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${organizer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {organizer.status === 'active'
                                                        ? 'Activo'
                                                        : 'Suspendido'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => handleToggleStatusClick(organizer)}
                                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${organizer.status === 'active' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                                >
                                                    {organizer.status === 'active'
                                                        ? 'Suspender'
                                                        : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredOrganizers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No se encontraron organizadores</p>
                            </div>
                        )}
                    </div>)
                }
            </main>
            {/* Confirmation Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCancelToggle}>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Confirmar acción
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {selectedOrganizer?.status === 'active'
                            ? '¿Estás seguro de suspender a este organizador?'
                            : '¿Estás seguro de activar a este organizador?'}
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button onClick={handleConfirmToggle} fullWidth>
                            Confirmar
                        </Button>
                        <Button onClick={handleCancelToggle} variant="secondary" fullWidth>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Organizers