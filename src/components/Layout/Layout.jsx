import React from 'react'
import { Outlet } from 'react-router-dom'
import LogoCDX from "/credx-logo.png"

const Layout = () => {
    return (
        <div>
            
            <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b">
                {/* Logo o imagen */}
                <div className="flex items-center">
                    <img
                    src={LogoCDX} // Cambia por la ruta real de tu imagen
                    alt="Logo"
                    className="h-4 w-30 mr-3"
                    />
                </div>
            </nav>

            <main>
                <Outlet/>
            </main>

        </div>
    )
}

export default Layout