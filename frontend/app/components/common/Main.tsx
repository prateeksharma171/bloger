import React from 'react'

const Main = ({ children }: { children: React.ReactNode }) => {
    return (
        <main
            className="min-h-screen"
            style={{ paddingTop: "var(--site-header-height)" }}
        >
            {children}
        </main>
    )
}

export default Main