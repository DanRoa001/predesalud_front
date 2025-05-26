import React, { useState } from 'react'
import { crediexpressAPI } from '../../api/axiosClient'
import { toast } from 'react-toastify'


const InitialForm = ({setStatus,setDocumentNumber}) => {

    const [document,setDocument] = useState()

    const searchPersonByDocument = async() => {
        try {

            const findData = await crediexpressAPI.post("func/search_person", {
                document_number : document
            })
            
            setStatus(findData.data.nextStep)
            setDocumentNumber(document)

        } catch (error) {
            console.log(error)
            toast.error(error)
        }

    } 

    const handleDocument = (e) => {
        setDocument(e.target.value)
    }

    return (
        <div className="bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div class="flex items-center justify-center h-full lg:mr-16">
                <div class="w-full ml-auto max-w-md bg-white shadow-2xl border border-gray-400 p-6 rounded-2xl">
                    <h2 class="text-4xl text-blue-600 text-center font-bold mb-4">
                        ¡Bienvenid@!
                    </h2>
                    <p className='text-center mt-3'> Ingresa la información solicitada para dar inicio a tu solicitud </p>
                    <form class="space-y-5 mt-5">
                        <div>
                            <label class="block text-sm font-medium mb-1" for="name">Número de documento: </label>
                            <input type="number" 
                                id="name"
                                placeholder='Ingresa tú número de documento.' 
                                class="w-full border border-gray-400 mt-2 rounded px-3 py-2 focus:outline-none 
                                focus:ring-2 focus:ring-yellow-300" 
                                onKeyUp={handleDocument}/>
                        </div>

                        <div className='col-span-2'>
                            <div className='bg-yellow-400 rounded-lg p-2 text-white 
                                font-semibold text-center cursor-pointer hover:bg-yellow-500'
                                onClick={() => searchPersonByDocument()}>
                                Enviar
                            </div>
                        </div>  
                    </form>
                </div>
            </div>
        </div>
    )
}

export default InitialForm