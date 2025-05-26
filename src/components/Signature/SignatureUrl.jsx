import React, { useEffect, useState } from 'react'
import { crediexpressAPI } from '../../api/axiosClient'
import { replace, useLocation, useParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'

const SignatureUrl = () => {

    const { id_request, document, cellphone } = useParams()
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        startIdentityValidation()
    }, [])
    

    const startIdentityValidation = async() => {
        try {

            setLoading(true)
            
            const response = await crediexpressAPI.post("/func/start_truora", {
                id_request : id_request,
                document_number : document,
                cellphone_number : cellphone
            })


            if(response.data.status == "approved"){
                setLoading(false)

                setTimeout(() => {
                    window.location.href = response.data.token_url
                }, 3000)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-xl h-fit bg-white rounded-xl shadow-2xl border border-gray-300 px-6 py-10 text-center">
                    <BeatLoader size={40} loading={loading} color='#689df2' className='my-3'/>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Espera un momento...</h2>
                    <p className="text-gray-700 text-lg">
                        Te llevaremos a validar tu identidad para continuar con el proceso.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignatureUrl