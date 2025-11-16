import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, CopyIcon, CheckIcon } from 'lucide-react'
import Button from '../../components/UI/Button'
import Modal from '../../components/UI/Modal'
import { generateAccessCode } from '../../services/codeGeneratorService'
import { accessCodeService } from '../../services/accessCodeService'
import Loading from '../../components/UI/Loading'

interface AccessCode {
    id: string
    code: string
    status: 'unused' | 'used'
    createdAt: string
    usedBy?: string
}
export const AccessCodes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [codes, setCodes] = useState<AccessCode[]>([])
    const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('all')
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newGeneratedCode, setNewGeneratedCode] = useState('')
    const [copiedFromModal, setCopiedFromModal] = useState(false)

    async function handleGenerateCode() {
        setLoading(true);
        setMessage('Generando Código...')
        try {
            const codeResponse = await generateAccessCode();
            const newCode: AccessCode = {
                id: codeResponse.id,
                code: codeResponse.code,
                status: 'unused',
                createdAt: codeResponse.created_at,
            }
            const updatedCodes = [newCode, ...codes]
            setCodes(updatedCodes)
            setNewGeneratedCode(codeResponse.code)
            setIsModalOpen(true)
            setCopiedFromModal(false)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
            setMessage('')
        }
    }

    useEffect(() => {
        // Apply filter from URL params if present
        const filterParam = searchParams.get('filter')
        if (filterParam === 'used' || filterParam === 'unused') {
            setFilter(filterParam)
        }
    }, [searchParams])

    useEffect(() => {
        const getCodes = async () => {
            try {
                setLoading(true)
                setMessage('Cargando...')
                const response = await accessCodeService.getAll();
                setCodes(
                    (response || []).map((p) => ({
                        id: String(p.id ?? p.id ?? ''),
                        code: String(p.code ?? ''),
                        status: p.is_used ? 'used' : 'unused',
                        createdAt: p.created_at ?? p.created_at ?? new Date().toISOString(),
                        usedBy: p.used_by_email ?? p.used_by_email ?? undefined,
                    }))
                );
            } catch (error) {
            } finally {
                setLoading(false)
                setMessage('')
            }
        }
        getCodes()
    }, [])

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleCopyFromModal = () => {
        navigator.clipboard.writeText(newGeneratedCode)
        setCopiedFromModal(true)
        setTimeout(() => setCopiedFromModal(false), 2000)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setNewGeneratedCode('')
        setCopiedFromModal(false)
    }

    const filteredCodes = codes.filter((code) => {
        if (filter === 'all') return true
        return code.status === filter
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
                    <h1 className="text-2xl font-bold text-gray-900">
                        Gestión de Códigos de Acceso
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Genera y administra códigos utilizados para activar campeonatos
                    </p>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Button
                        onClick={handleGenerateCode}
                        className="flex items-center gap-2"
                    >
                        <PlusIcon size={18} />
                        Generar nuevo código
                    </Button>
                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Filtrar por estado:
                        </label>
                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value as 'all' | 'unused' | 'used')
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos</option>
                            <option value="unused">No usados</option>
                            <option value="used">Usados</option>
                        </select>
                    </div>
                </div>
                {/* Table */}
                {loading
                    ? <Loading message={message} fullScreen />
                    :
                    (<div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha creación
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usado por
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCodes.map((code) => (
                                        <tr key={code.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="text-sm font-mono text-gray-900">
                                                    {code.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${code.status === 'unused' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {code.status === 'unused' ? 'No usado' : 'Usado'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(code.createdAt).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {code.usedBy || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => handleCopyCode(code.code, code.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    {copiedId === code.id ? (
                                                        <>
                                                            <CheckIcon size={14} />
                                                            Copiado
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CopyIcon size={14} />
                                                            Copiar
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredCodes.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No hay códigos para mostrar</p>
                            </div>
                        )}
                    </div>)
                }
            </main>
            {/* Modal de código generado */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Código generado
                    </h2>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
                        <code className="text-2xl font-mono font-bold text-gray-900 break-all">
                            {newGeneratedCode}
                        </code>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleCopyFromModal}
                            fullWidth
                            className="flex items-center justify-center gap-2"
                        >
                            {copiedFromModal ? (
                                <>
                                    <CheckIcon size={18} />
                                    Copiado
                                </>
                            ) : (
                                <>
                                    <CopyIcon size={18} />
                                    Copiar código
                                </>
                            )}
                        </Button>
                        <Button onClick={handleCloseModal} variant="secondary" fullWidth>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AccessCodes