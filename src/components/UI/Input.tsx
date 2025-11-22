import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
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
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
    value,
    onChange
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput && showPassword ? 'text' : type
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    return (
        <div className={`mb-4 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-neutral-dark mb-1"
            >
                {label} {required && <span className="text-state-wo">*</span>}
            </label>
            <div className='relative'>
                <input
                    autoComplete='off'
                    type={inputType}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...register}
                    className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-state-wo' : 'border-neutral-medium'} focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors ${isPasswordInput ? 'pr-12' : ''}`}
                />
                {isPasswordInput && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium hover:text-neutral-dark transition-colors p-1"
                        aria-label={
                            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        }
                    >
                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-state-wo">{error}</p>}
        </div>
    )
}

export default Input