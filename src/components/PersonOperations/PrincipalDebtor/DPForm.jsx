import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiColombia, crediexpressAPI } from "../../../api/axiosClient";
import { checkAge, formatCurrency, nationalities } from "../../../utils/utils"
import { dpFormSchema } from "../../../validators/dpForm";
import { dpUpdateFormSchema } from "../../../validators/dpUpdateForm";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const DPForm = ({person_data, setStatus}) => {

    const { document_number } = useParams()

    const { register, handleSubmit , setValue, formState: { errors }} = useForm({ 
        resolver: yupResolver(person_data ? dpUpdateFormSchema : dpFormSchema)
    });

    const [requestedAmountDisplay, setRequestedAmountDisplay] = useState('');

    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            const response = await apiColombia.get("/City");

            const data = response.data.map((city) => ({
                id: city.id,
                name: city.name,
            }));

            setCities(data);
        };

        fetchCities();
    }, []);

    
    useEffect(() => {
        if (person_data) {
            const [first_name, second_name, ...lastNames] = person_data.name.split(" ");
            const [first_lastname = "", second_lastname = ""] = lastNames;

            setValue("first_name", first_name || "");
            setValue("second_name", second_name || "");
            setValue("first_lastname", first_lastname);
            setValue("second_lastname", second_lastname);
            setValue("email", person_data.email || "");
            setValue("document_type", person_data.document_type || "");
            setValue("document_number", person_data.document_number || "");
            setValue("birthdate", person_data.birthdate || "");
            setValue("expedition_date", person_data.expedition_date || "");
            setValue("cellular", person_data.cellular || "");
            setValue("nationality", person_data.nationality || "");
            setValue("address", person_data.address || "");
            setValue("city", person_data.city || "");
            setValue("gender", person_data.gender || "");
        }
    }, [person_data]);


    useEffect(() => {
        if (document_number) {
            setValue("document_number", document_number);
        }
    }, [document_number]);

    const onSubmit = async (data) => {

        var requestedAmount

        try {
            const {
                first_name,
                second_name,
                first_lastname,
                second_lastname,
                email,
                document_type,
                document_number,
                cellular,
                birthdate,
                nationality,
                expedition_date,
                address,
                city,
                gender,
                requested_amount,
            } = data;

            const fullname = [
                first_name,
                second_name,
                first_lastname,
                second_lastname,
            ].filter(Boolean).join(" ");

            const payload = {
                name: fullname,
                email,
                document_type,
                document_number,
                cellular,
                birthdate,
                nationality,
                expedition_date,
                address,
                city,
                gender,
                requested_amount,
            };

            requestedAmount = payload.requested_amount

            if (person_data) {

                delete payload.requested_amount                

                const updateRes = await crediexpressAPI.put("/func/update_only_dp", {
                    id_person: person_data.id_person,
                    person_data: payload,
                });

                toast.success("Persona actualizada correctamente");
                localStorage.setItem("id_person_dp", updateRes.data.id_person);
                // setStatus("startRequest"); // O el paso que siga
                return;
            }


            // Modo creación
            const response = await crediexpressAPI.post("/func/create_only_dp", {
                person_data: payload,
            });



            if (response.data.status === "approved") {
                localStorage.setItem("id_person_dp", response.data.id_person);
                localStorage.setItem("requested_amount",requestedAmount)
                toast.success("Registro creado")
                setStatus("startRequest");
            }

        } catch (error) {
            if (error.response?.data?.status === "rejected") {

                localStorage.setItem("id_person_dp", error.response.data.id_person)
                localStorage.setItem("requested_amount",requestedAmount)

                withReactContent(Swal).fire({
                    title: "No cumples con los parámetros del motor",
                    text: "¿Deseas añadir un deudor solidario para continuar?",
                    showConfirmButton: true,
                    confirmButtonText: "Añadir",
                    showDenyButton: true,
                    denyButtonText: "No añadir",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setStatus("joint_debtor");
                    } else {
                        setStatus("");
                    }
                });
            } else {
                console.error("❌ Error:", error);
                toast.error(error.response?.data?.error)
            }
        }
    };

    return (
            <div className="min-h-screen grid items-center justify-end bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center w-full p-5">
                <div className="w-full max-w-xl bg-white shadow-2xl border border-gray-400 p-5 lg:p-3 rounded-2xl">

                {/* <h2 className="text-4xl text-blue-600 text-center font-bold mb-4">¡Bienvenid@!</h2> */}
                <p className="text-center mt-3">Ingresa la información solicitada para continuar con tu solicitud</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-5 lg:p-4 grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium">Primer nombre:</label>
                        <input type="text" {...register("first_name")} id="first_name"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu primer nombre"/>

                        {errors.first_name && (
                            <span className="text-red-500 text-sm mt-2">{errors.first_name.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="second_name" className="block text-sm font-medium">Segundo nombre:</label>
                        <input type="text" {...register("second_name")} id="second_name"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu segundo nombre"/>

                        {errors.second_name && (
                            <span className="text-red-500 text-sm mt-2">{errors.second_name.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="first_lastname" className="block text-sm font-medium">Primer apellido:</label>
                        <input type="text" {...register("first_lastname")} id="first_lastname"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu primer apellido"/>

                        {errors.first_lastname && (
                            <span className="text-red-500 text-sm mt-2">{errors.first_lastname.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="second_lastname" className="block text-sm font-medium">Segundo apellido:</label>
                        <input type="text" {...register("second_lastname")} id="second_lastname"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu segundo apellido"/>

                        {errors.second_lastname && (
                            <span className="text-red-500 text-sm mt-2">{errors.second_lastname.message}</span>
                        )}
                    </div>


                    <div className="col-span-2">
                        <label htmlFor="birthdate" className="block text-sm font-medium">Fecha de nacimiento:</label>
                        <input type="date" {...register("birthdate")} id="birthdate"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"/>

                        {errors.birthdate && (
                            <span className="text-red-500 text-sm mt-2">{errors.birthdate.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="document_type" className="block text-sm font-medium">Tipo de documento:</label>
                        <select {...register("document_type")}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300">
                            <option value="">Selecciona..</option>
                            <option value="CC"> Cédula de ciudadania</option>
                            <option value="CE"> Cédula de extranjeria</option>
                            <option value="PP"> Pasaporte</option>
                        </select>

                        {errors.document_type && (
                            <span className="text-red-500 text-sm mt-2">{errors.document_type.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="document_number" className="block text-sm font-medium">Número de documento:</label>
                        <input type="number" {...register("document_number")} id="document_number"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu número de documento"/>

                        {errors.document_number && (
                            <span className="text-red-500 text-sm mt-2">{errors.document_number.message}</span>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="expedition_date" className="block text-sm font-medium">Fecha de expedición:</label>
                        <input type="date" {...register("expedition_date")} id="expedition_date"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"/>


                        {errors.expedition_date && (
                            <span className="text-red-500 text-sm mt-2">{errors.expedition_date.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cellular" className="block text-sm font-medium">Celular:</label>
                        <input type="number" {...register("cellular")} id="cellular" maxLength={10} minLength={4}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu celular"/>

                        {errors.cellular && (
                            <span className="text-red-500 text-sm mt-2">{errors.cellular.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Correo:</label>
                        <input type="email" {...register("email")} id="email"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu correo"/>

                        {errors.email && (
                            <span className="text-red-500 text-sm mt-2">{errors.email.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nationality" className="block text-sm font-medium">Nacionalidad:</label>
                        <select {...register("nationality")}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300">
                            <option value="">Selecciona una nacionalidad</option>
                            {nationalities.map((nation) => (
                                <option key={nation} value={nation}>{nation}</option>
                            ))}
                        </select>

                        {errors.nationality && (
                            <span className="text-red-500 text-sm mt-2">{errors.nationality.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium">Ciudad:</label>
                        <select {...register("city")}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300">
                            <option value="">Selecciona una ciudad</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.name}>{city.name}</option>
                            ))}
                        </select>

                        {errors.city && (
                            <span className="text-red-500 text-sm mt-2">{errors.city.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Dirección:</label>
                        <input type="text" {...register("address")} id="address"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu dirección"/>

                        {errors.address && (
                            <span className="text-red-500 text-sm mt-2">{errors.address.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium">Género:</label>
                        <select {...register("gender")}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300">
                            <option value="">Selecciona...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>

                        {errors.gender && (
                            <span className="text-red-500 text-sm mt-2">{errors.gender.message}</span>
                        )}
                    </div>

                    {!person_data && (
                        <div className="md:col-span-2">
                            <label htmlFor="requested_amount" className="block text-sm font-medium">Monto solicitado:</label>
                            <input
                                type="text"
                                id="requested_amount"
                                value={requestedAmountDisplay}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const raw = input.replace(/\D/g, ""); // Elimina todo excepto números
                                    setRequestedAmountDisplay(formatCurrency(raw)); // Formatea para mostrar
                                    setValue("requested_amount", parseInt(raw)); // Actualiza el valor real
                                }}
                                className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none text-center
                                focus:ring-2 focus:ring-yellow-300"
                                placeholder="Ingresa el monto solicitado"
                            />

                            {errors.requested_amount && (
                                <span className="text-red-500 text-sm mt-2">{errors.requested_amount.message}</span>
                            )}
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <button type="submit"
                            className="w-full bg-yellow-400 rounded-lg p-2 text-white font-semibold text-center hover:bg-yellow-500">
                            {!person_data ? `Enviar` : `Actualizar`}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default DPForm;