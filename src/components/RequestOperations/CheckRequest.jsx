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
    const idFromQuery = searchParams.get("id")

    const [dpData, setDpData] = useState(null)
    const [dsData, setDsData] = useState(null)
    const navigate = useNavigate()

    const [loadingRequest,setLoadingRequest] = useState(false)

    const getFullName = ({ first_name, middle_name, first_surname, second_last_name }) => {
        return [first_name, middle_name, first_surname, second_last_name].filter(Boolean).join(" ");
    };

    useEffect(() => {
        const id_person_dp = localStorage.getItem("id_person_dp")
        const id_person_ds = localStorage.getItem("id_person_ds")

        const fetchPerson = async (id, setDataFn, label) => {
            try {
                const response = await crediexpressAPI.post("/func/find_person", {
                    id_person: id
                })

                setDataFn(response.data)
            } catch (error) {
                console.error(`❌ Error al obtener datos de ${label}:`, error)
                toast.error(`Error consultando datos de ${label}`)
            }
        }

        if (id_person_dp) fetchPerson(id_person_dp, setDpData, "deudor principal")
        if (id_person_ds) fetchPerson(id_person_ds, setDsData, "deudor solidario")
    }, [])


    const startRequest = async () => {
        try {

            setLoadingRequest(true)

            const id_person_dp = localStorage.getItem("id_person_dp");
            const id_person_ds = localStorage.getItem("id_person_ds"); // puede ser null
            const requested_amount = localStorage.getItem("requested_amount");

            if (!id_person_dp || !requested_amount) {
                toast.error("Faltan datos para iniciar la solicitud.");
                return;
            }

            const response = await crediexpressAPI.post("/func/start_request", {
                id_person_dp,
                id_person_ds,
                requested_amount,
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

    return (
        <div className="bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div className="flex flex-col items-center justify-center h-full text-center lg:mr-16">
                <div className="w-full max-w-lg bg-white shadow-2xl border border-gray-400 p-6 rounded-2xl">
                    <h1 className="text-2xl font-bold mb-4">Resumen de la Solicitud</h1>

                    <hr className="mt-3"/>


                    {loadingRequest && (
                        <>
                            <BeatLoader size={20} color="#689df2" className="my-3" />
                            <h2 className="text-xl font-bold text-blue-600 mb-2">Espera un momento...</h2>
                            <p className="text-gray-700">Estamos iniciando tu solicitud.</p>
                        </>
                    )}

                    { !loadingRequest &&  dpData && (
                        <div className="mb-4 text-left">
                            <h2 className="text-xl font-semibold text-blue-600">🧑 Deudor Principal</h2>
                            <p><strong>Nombre: </strong> {getFullName(dpData)}</p>
                            <p><strong>Documento:</strong> {dpData.document_number}</p>
                            <p><strong>Correo:</strong> {dpData.email}</p>
                            <p><strong>Documento:</strong> {dpData.document_number}</p>
                            <p><strong>Correo:</strong> {dpData.email}</p>
                            <p><strong>Documento:</strong> {dpData.document_number}</p>
                            <p><strong>Correo:</strong> {dpData.email}</p>
                        </div>
                    )}

                    {!loadingRequest && dsData && (
                        <div className="mb-4 text-left">
                            <h2 className="text-xl font-semibold text-green-600">👥 Deudor Solidario</h2>
                            <p><strong>Nombre:</strong> {getFullName(dsData)}</p>
                            <p><strong>Documento:</strong> {dsData.document_number}</p>
                            <p><strong>Correo:</strong> {dsData.email}</p>
                        </div>
                    )}

                    {!loadingRequest && localStorage.getItem("requested_amount") && (
                        <div className="mb-4 text-left">
                            <h2 className="text-xl font-semibold text-green-600">
                                Monto solicitado: {formatCurrency(localStorage.getItem("requested_amount"))}
                            </h2>
                        </div>
                    )}

                    {!loadingRequest && (
                        <div className="md:col-span-2 w-full">
                            <button
                                type="button"
                                onClick={startRequest}
                                className="w-full bg-yellow-400 rounded-lg p-2 text-white font-semibold text-center hover:bg-yellow-500"
                            >
                                Iniciar solicitud
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default CheckRequest