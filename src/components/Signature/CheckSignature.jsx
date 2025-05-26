import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { crediexpressAPI } from "../api/axiosClient";
import { toast } from "react-toastify";

const CheckValidation = () => {
    const [params] = useSearchParams();
    const process_id = params.get("process_id");

    const [signatureUrl, setSignatureUrl] = useState(null);
    const [polling, setPolling] = useState(true);

    useEffect(() => {
        if (!process_id) return;

        const interval = setInterval(async () => {
            try {
                const response = await crediexpressAPI.get("/func/retrieve_validation", {
                    params: { process_id }
                });

                const { url_zapsign } = response.data;

                if (url_zapsign) {
                    setSignatureUrl(url_zapsign);
                    setPolling(false);
                    toast.success("Validación exitosa. Procede a la firma.");
                }

            } catch (error) {
                const errorMsg = error.response?.data?.error;

                if (errorMsg?.includes("pendiente")) {
                    // sigue intentando, no mostramos error
                    return;
                }

                // otro error: detiene polling
                setPolling(false);
                toast.error(errorMsg || "Error durante la validación");
            }
        }, 5000); // cada 5 segundos

        if (!polling) clearInterval(interval);

        return () => clearInterval(interval);s
    }, [process_id, polling]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            {signatureUrl ? (
                <iframe
                src={signatureUrl}
                title="Firma electrónica"
                className="w-full h-full min-h-[600px] rounded-xl border shadow-xl"
                allowFullScreen
                />
            ) : (
                <p className="text-center text-gray-600 text-xl">
                    Esperando validación de identidad...
                </p>
            )}
        </div>
    );
};

export default CheckValidation;
