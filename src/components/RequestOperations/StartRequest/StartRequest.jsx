import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crediexpressAPI } from '../../../api/axiosClient'
import { toast } from 'react-toastify'

const StartRequest = () => {

    const [document, setDocument] = useState("")
    const navigate = useNavigate()

    const searchPersonByDocument = async () => {
        if (!document) {
            toast.warn("Por favor ingresa un número de documento")
            return
        }

        try {
            const response = await crediexpressAPI.post("func/search_request", {
                document_number: document,
            })

            const { nextStep, id_person } = response.data

            switch (nextStep) {
                case "startRequest":
                    navigate(`/check_request?id=${id_person}`)
                break
            }
        } catch (error) {
            console.error(error)
            toast.error("Error al buscar el documento")
        }
    }

    return (
        <div className="bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div className="flex items-center justify-center h-full lg:mr-16">
                <div className="w-full ml-auto max-w-md bg-white shadow-2xl border border-gray-400 p-6 rounded-2xl">
                    {/* <h2 className="text-4xl text-blue-600 text-center font-bold mb-4">¡Bienvenid@!</h2> */}
                    <p className="text-center mt-3">Ingresa la información para dar inicio a tu solicitud</p>
                    <form className="space-y-5 mt-5" onSubmit={e => e.preventDefault()}>
                        <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="doc">Número de documento:</label>
                        <input
                            type="number"
                            id="doc"
                            placeholder="Ingresa tú número de documento"
                            className="w-full border border-gray-400 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            onChange={e => setDocument(e.target.value)}
                            value={document}
                        />
                        </div>

                        <div className="col-span-2">
                        <div
                            className="bg-yellow-400 rounded-lg p-2 text-white font-semibold text-center cursor-pointer hover:bg-yellow-500"
                            onClick={searchPersonByDocument}
                        >
                            Enviar
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StartRequest