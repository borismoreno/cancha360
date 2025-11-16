import React from 'react'
import { XIcon } from 'lucide-react'
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XIcon size={20} />
                </button>
                {children}
            </div>
        </div>
    )
}
export default Modal
