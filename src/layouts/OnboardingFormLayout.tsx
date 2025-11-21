import type React from "react"

interface OnboardingFormLayoutProps {
    title: string
    subtitle: string
    children: React.ReactNode
}

const OnboardingFormLayout = ({
    title,
    subtitle,
    children,
}: OnboardingFormLayoutProps) => {
    return (
        <div className="min-h-screen bg-neutral-light flex flex-col">
            {/* Header with Logo - Mobile Only */}
            <div className="lg:hidden bg-white border-b border-neutral-medium">
                <div className="max-w-md mx-auto px-4 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-brand">Cancha360</h1>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - Illustration (Desktop Only) */}
                        <div className="hidden lg:flex items-center justify-center bg-linear-to-br from-brand to-brand-dark rounded-2xl p-12">
                            <div className="text-center">
                                {/* Soccer Field SVG Illustration */}
                                <svg
                                    viewBox="0 0 400 500"
                                    className="w-full max-w-md mx-auto"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Field */}
                                    <rect
                                        x="50"
                                        y="50"
                                        width="300"
                                        height="400"
                                        rx="8"
                                        fill="#0FA958"
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    {/* Center Line */}
                                    <line
                                        x1="50"
                                        y1="250"
                                        x2="350"
                                        y2="250"
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                    {/* Center Circle */}
                                    <circle
                                        cx="200"
                                        cy="250"
                                        r="40"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <circle cx="200" cy="250" r="3" fill="white" />
                                    {/* Top Penalty Area */}
                                    <rect
                                        x="125"
                                        y="50"
                                        width="150"
                                        height="60"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    {/* Top Goal Area */}
                                    <rect
                                        x="160"
                                        y="50"
                                        width="80"
                                        height="25"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    {/* Bottom Penalty Area */}
                                    <rect
                                        x="125"
                                        y="390"
                                        width="150"
                                        height="60"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    {/* Bottom Goal Area */}
                                    <rect
                                        x="160"
                                        y="425"
                                        width="80"
                                        height="25"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    {/* Corner Arcs */}
                                    <path
                                        d="M 50 50 Q 60 50 60 60"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 350 50 Q 340 50 340 60"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 50 450 Q 60 450 60 440"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 350 450 Q 340 450 340 440"
                                        stroke="white"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    {/* Soccer Ball */}
                                    <circle cx="200" cy="180" r="20" fill="white" />
                                    <path
                                        d="M 200 160 L 200 200 M 180 180 L 220 180"
                                        stroke="#0FA958"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="200"
                                        cy="180"
                                        r="20"
                                        stroke="#0FA958"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-white mb-3">
                                        Cancha360
                                    </h2>
                                    <p className="text-white/90">
                                        Gestiona tu campeonato de fútbol de forma profesional
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Right Column - Form Content */}
                        <div className="flex items-center">
                            <div className="w-full max-w-md mx-auto lg:mx-0">
                                <div className="bg-white rounded-xl shadow-lg p-8">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                                            {title}
                                        </h2>
                                        <p className="text-neutral-medium">{subtitle}</p>
                                    </div>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingFormLayout