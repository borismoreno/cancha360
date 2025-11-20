interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
    logo?: boolean
}
export const AuthLayout = ({
    children,
    title,
    subtitle,
    logo = true,
}: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-neutral-light">
            <div className="w-full md:max-w-2xl max-w-md">
                {logo && (
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-brand">Cancha360</h1>
                    </div>
                )}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-2">{title}</h2>
                    {subtitle && <p className="text-neutral-medium mb-6">{subtitle}</p>}
                    {children}
                </div>
            </div>
        </div>
    )
}
