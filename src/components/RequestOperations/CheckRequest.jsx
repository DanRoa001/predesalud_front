import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { crediexpressAPI } from '../../api/axiosClient';
import { formatCurrency } from '../../utils/utils';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const CheckRequest = () => {

    const [searchParams] = useSearchParams()
    const idPersonFromQuery = searchParams.get("id")
    const idRequestFromQuery = searchParams.get("request")


    const [dpData, setDpData] = useState(null)
    const [dsData, setDsData] = useState(null)
    const [requestData,setRequestData] = useState("")
    const navigate = useNavigate()

    const [loadingRequest,setLoadingRequest] = useState(false)

    const [checkBoxAuthorize,setCheckBoxAuthorize] = useState(false)
    const [dataProcessing,setDataProcessing] = useState(false)
    const [digitalSign,setDigitalSign] = useState(false)

    const getFullName = ({ first_name, middle_name, first_surname, second_last_name }) => {
        return [first_name, middle_name, first_surname, second_last_name].filter(Boolean).join(" ");
    };

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const response = await crediexpressAPI.post("/func/find_person_request", {
                    id_request: idRequestFromQuery
                })


                if(response.data.ds){
                    setDsData(response.data.ds)
                }

                setDpData(response.data.dp)
                setRequestData(response.data.request_data)

            } catch (error) {
                console.error(`❌ Error al obtener datos`, error)
                toast.error(`Error consultando datos`)
            }
        }

        fetchPerson()

    }, [])


    const startRequest = async () => {
        try {

            setLoadingRequest(true)

            const response = await crediexpressAPI.post("/func/start_request", {
                id_request : idRequestFromQuery,
                id_client : import.meta.env.VITE_CLIENT_ID,
            });

            const { id_request, nextStep } = response.data;

            setLoadingRequest(false)

            if (nextStep === "signature") {
                navigate(`/sign/${id_request}/${dpData.document_number}/${dpData.cellular}`);
            }

        } catch (error) {
            const message = error.response?.data?.error || "Hubo un error al iniciar la solicitud.";
            toast.error(message);
        }
    };

    const handleAuthorize = () => {
        setCheckBoxAuthorize(!checkBoxAuthorize)
    }
    const handleProcessing = () => {
        setDataProcessing(!dataProcessing)
    }

    const handleSign = () => {
        setDigitalSign(!digitalSign)
    }



    return (
        <div className="min-h-screen bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center w-full p-5">
            <div className="flex min-h-screen justify-center lg:justify-end items-start text-center lg:pr-16">
                <div className="w-full max-w-lg bg-white shadow-2xl border border-gray-400 p-6 rounded-2xl">
                    <h1 className="text-2xl font-bold mb-4">Resumen de la Solicitud</h1>

                    {loadingRequest && (
                        <>
                            <BeatLoader size={20} color="#689df2" className="my-3" />
                            <h2 className="text-xl font-bold text-blue-600 mb-2">Espera un momento...</h2>
                            <p className="text-gray-700">Estamos iniciando tu solicitud.</p>
                        </>
                    )}

                    {!loadingRequest && dpData && (
                        <div className="mb-4 text-left border shadow-lg p-2 rounded ">
                            <table className="w-full text-sm border border-gray-300  rounded">
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className='border-b text-center p-2'>
                                            <h2 className="text-xl font-semibold text-yellow-600 mb-2">🧑 Deudor Principal</h2>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Nombre:</td>
                                        <td className="px-2 py-1">{getFullName(dpData)}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Número de celular:</td>
                                        <td className="px-2 py-1">{dpData.cellular}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Correo:</td>
                                        <td className="px-2 py-1">{dpData.email}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Documento:</td>
                                        <td className="px-2 py-1">{`${dpData.document_type} ${dpData.document_number}`}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Lugar de expedición:</td>
                                        <td className="px-2 py-1">{dpData.expedition_location}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Nacionalidad:</td>
                                        <td className="px-2 py-1">{dpData.nationality}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Fecha de nacimiento:</td>
                                        <td className="px-2 py-1">{dpData.birthdate}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Dirección:</td>
                                        <td className="px-2 py-1">{dpData.address}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Ciudad:</td>
                                        <td className="px-2 py-1">{dpData.city}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loadingRequest && dsData && (
                        <div className="mb-4 text-left border shadow-lg p-2 rounded ">
                            <table className="w-full text-sm border border-gray-300  rounded">
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className='border-b text-center p-2'>
                                            <h2 className="text-xl font-semibold text-yellow-600 mb-2">👥 Deudor Solidario</h2>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Nombre:</td>
                                        <td className="px-2 py-1">{getFullName(dsData)}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Número de celular:</td>
                                        <td className="px-2 py-1">{dsData.cellular}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Correo:</td>
                                        <td className="px-2 py-1">{dsData.email}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Documento:</td>
                                        <td className="px-2 py-1">{`${dsData.document_type} ${dsData.document_number}`}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Lugar de expedición:</td>
                                        <td className="px-2 py-1">{dsData.expedition_location}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-semibold px-2 py-1">Nacionalidad:</td>
                                        <td className="px-2 py-1">{dsData.nationality}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold px-2 py-1">Fecha de nacimiento:</td>
                                        <td className="px-2 py-1">{dsData.birthdate}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold px-2 py-1">Dirección:</td>
                                        <td className="px-2 py-1">{dsData.address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {requestData && !loadingRequest && (
                        <div className="mb-4 text-center border p-2 rounded shadow">
                            <h2 className="text-xl font-semibold text-blue-500">
                                Monto solicitado: {formatCurrency(requestData.amount)}
                            </h2>
                        </div>
                    )}

                    {!loadingRequest && (
                        <>
                        
                            <div className="md:col-span-2 w-full mb-2">
                                <button
                                    type="button"
                                    onClick={startRequest}
                                    className="w-full bg-blue-400 rounded-lg p-2 text-white font-semibold text-center hover:bg-blue-500"
                                >
                                    Iniciar
                                </button>
                            </div>


                            <div className="md:col-span-2 w-full">
                                <button
                                    type="button"
                                    onClick={startRequest}
                                    className="w-full bg-blue-300 rounded-lg p-2 text-white font-semibold text-center hover:bg-blue-500"
                                >
                                    ← Ir atras
                                </button>

                            </div>
                        </>
                    )}


                    {!loadingRequest && (
                        <div className="space-y-3 mt-6 text-sm text-left">
                            <div className="flex items-start">
                                <input
                                type="checkbox"
                                id="auth_centrales"
                                className="mt-1 mr-3 accent-yellow-500"
                                />
                                <label htmlFor="auth_centrales">
                                Autorizo a ValCredit a consultar y reportar mi información a las centrales de riesgo.
                                </label>
                            </div>

                            <div className="flex items-start">
                                <input
                                type="checkbox"
                                id="data_policy"
                                className="mt-1 mr-3 accent-yellow-500"
                                />
                                <label htmlFor="data_policy">
                                He leído, comprendido y acepto la <a href="/politica-de-datos" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Política de Tratamiento de Datos Personales</a>.
                                </label>
                            </div>

                            <div className="flex items-start">
                                <input
                                type="checkbox"
                                id="digital_contract"
                                className="mt-1 mr-3 accent-yellow-500"
                                />
                                <label htmlFor="digital_contract">
                                Autorizo firmar electrónicamente y acepto las condiciones de contratación digital.
                                </label>
                            </div>
                        </div>
                    )}
                    

                </div>
            </div>
        </div>
    )
}


export default CheckRequest