import type { UseFormRegisterReturn } from 'react-hook-form'
interface InputProps {
    label: string
    type?: string
    id: string
    name: string
    placeholder?: string
    required?: boolean
    error?: string
    className?: string
    register?: UseFormRegisterReturn
}
const Input = ({
    label,
    type = 'text',
    id,
    placeholder = '',
    required = false,
    error,
    className = '',
    register,
}: InputProps) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-neutral-dark mb-1"
            >
                {label} {required && <span className="text-state-wo">*</span>}
            </label>
            <input
                autoComplete='off'
                type={type}
                id={id}
                placeholder={placeholder}
                {...register}
                className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-state-wo' : 'border-neutral-medium'} focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors`}
            />
            {error && <p className="mt-1 text-sm text-state-wo">{error}</p>}
        </div>
    )
}

export default Input