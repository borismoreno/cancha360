import React from 'react'
interface OnboardingListLayoutProps {
    title: string
    subtitle: string
    sidebarContent: React.ReactNode
    mainContent: React.ReactNode
    actions: React.ReactNode
}

const OnboardingListLayout = ({
    title,
    subtitle,
    sidebarContent,
    mainContent,
    actions,
}: OnboardingListLayoutProps) => {
    return (
        <div className="min-h-screen bg-neutral-light flex flex-col">
            {/* Header with Logo */}
            <div className="bg-white border-b border-neutral-medium">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-brand">Cancha360</h1>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-neutral-dark">{title}</h2>
                        <p className="text-neutral-medium mt-2">{subtitle}</p>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Two Column Layout on Desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column - Sidebar (Sticky on Desktop) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="lg:sticky lg:top-6 space-y-6">
                                {sidebarContent}
                                {/* Action Buttons - Desktop Only */}
                                <div className="hidden lg:block space-y-3">{actions}</div>
                            </div>
                        </div>
                        {/* Right Column - Main Content */}
                        <div className="lg:col-span-8">{mainContent}</div>
                    </div>
                    {/* Action Buttons - Mobile Only */}
                    <div className="lg:hidden mt-6 space-y-3">{actions}</div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingListLayout