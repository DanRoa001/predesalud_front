import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify';
import { crediexpressAPI } from '../../../api/axiosClient';

const SignDocument = () => {

    const [loading, setLoading] = useState(true);
    const [params] = useSearchParams();
    const process_id = params.get('process_id');
    const alreadyNotified = useRef({ loaded: false, signed: false });

    const navigate = useNavigate()
    const [zapSignUrl,setZapSignUrl] = useState("")

    useEffect(() => {
        if (!process_id) return;

        const interval = setInterval(async () => {

            if(zapSignUrl) return;

            try {
                const response = await crediexpressAPI.get('/func/retrieve_validation', {
                    params: { process_id }
                });

                const { url_zapsign } = response.data;

                if (url_zapsign) {

                    clearInterval(interval);
                    setLoading(false);
                    setZapSignUrl(url_zapsign)
                    toast.success("Validación exitosa. Redirigiendo a la firma...");
                }

            } catch (error) {

                console.log(error)

                const errMsg = error.response?.data?.error;

                if (errMsg?.includes("pendiente")) {
                    // no hacemos nada, seguimos intentando
                    return;
                }

                clearInterval(interval);
                toast.error(errMsg || "Error en la validación");
                setLoading(false);
            }
        }, 5000); // cada 5 segundos

        return () => clearInterval(interval);
    }, [process_id]);


    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data === "zs-doc-signed" && !alreadyNotified.current.signed) {
                toast.success("✍️ Documento firmado");
                alreadyNotified.current.signed = true;
                navigate("/signed_document")
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);


    return (
        <div className="bg-[url('./assets/bg-pred.png')] bg-cover bg-center h-dvh w-full p-5">
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden">
                    {!loading && zapSignUrl ? (
                        <>
                        	<iframe src={zapSignUrl}
                                    title="Firma electronica"
                                    className='w-full h-full'>
                            </iframe>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <BeatLoader size={40} loading={loading} color="#689df2" className="mb-6" />
                            <h2 className="text-2xl font-bold text-blue-600 mb-4">Espera un momento...</h2>
                            <p className="text-gray-700 text-lg max-w-xl">
                            Estamos revisando el resultado de tu validación de identidad. Si todo sale bien, te enviaremos a firmar el documento para aprobar tu solicitud.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default SignDocument