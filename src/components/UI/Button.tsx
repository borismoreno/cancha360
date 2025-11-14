interface ButtonProps {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    fullWidth?: boolean
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    className?: string
    isLoading?: boolean
}

const Button = ({
    children,
    type = 'button',
    onClick,
    fullWidth = false,
    variant = 'primary',
    disabled = false,
    className = '',
    isLoading = false,
}: ButtonProps) => {
    const baseStyles =
        'py-3 px-6 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2'
    const variantStyles = {
        primary: 'bg-[#0FA958] hover:bg-[#0C7C43] text-white focus:ring-[#0FA958]',
        secondary:
            'bg-neutral-light hover:bg-neutral-medium text-neutral-dark focus:ring-neutral-medium',
    }
    const widthStyles = fullWidth ? 'w-full' : ''
    const disabledStyles =
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    )
}

export default Button