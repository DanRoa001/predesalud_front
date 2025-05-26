import React from 'react'
import { useNavigate } from 'react-router-dom'

const SignedDocument = () => {

    const navigate = useNavigate()

    return (
        <div className="bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-300 px-6 py-10 text-center">
                    <div className="text-green-500 text-6xl mb-4">✔️</div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">¡Documento firmado!</h2>
                    <p className="text-gray-700 text-lg">
                        Tu solicitud ha sido aprobada. Pronto uno de nuestros asesores se pondrá en contacto contigo.
                    </p>

                    <button onClick={() => navigate("/")} className='text-blue-600 font-bold mt-3 hover:text-blue-700 underline cursor-pointer'>
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignedDocument