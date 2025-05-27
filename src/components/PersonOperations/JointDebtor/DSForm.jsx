import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiColombia, crediexpressAPI } from "../../../api/axiosClient";
import { checkAge, nationalities } from "../../../utils/utils";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { toast } from "react-toastify";
import { dsFormSchema } from "../../../validators/dsForm";

const DSForm = () => {

    const { register, handleSubmit , formState: { errors }} = useForm({ 
        resolver: yupResolver(dsFormSchema)
    });

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

    const onSubmit = async (data) => {
        try {
            const {
                first_name,
                second_name,
                first_surname,
                second_last_name,
                email,
                document_type,
                document_number,
                cellular,
                birthdate,
                nationality,
                expedition_location,
                address,
                city,
            } = data;

            if(nationality != "Colombia"){
                toast.error("La nacionalidad debe ser Colombiana")
                return
            }

            const age = await checkAge(birthdate)

            if(age < 21){
                toast.error("Debes tener más de 20 años")
                return
            }


            const fullname = [
                first_name,
                second_name,
                first_surname,
                second_last_name,
            ].filter(Boolean).join(" ");


            const payload = {
                first_name,
                middle_name: second_name,         // Opcional
                first_surname,
                second_last_name: second_last_name, // Opcional
                email,
                document_type,
                document_number,
                cellular,
                birthdate,
                nationality,
                expedition_location,
                address,
                city,
                requested_amount,
            }

            // Enviar al backend
            const response = await crediexpressAPI.post("/func/create_only_ds", {
                person_data: payload
            });

            toast.success("Se realizó el registro del deudor solidario")
            localStorage.setItem("id_person_ds", response.data.id_person)
            

        } catch (error) {
            console.error("Error en envío:", error);
            toast.error("Hubo un error al enviar los datos");
        }
    };

    return (
            <div className="min-h-screen grid items-center justify-end bg-[url('./assets/bg-pred-resp.png')] md:bg-[url('./assets/bg-pred.png')] bg-cover bg-center w-full p-5">
                <div className="w-full max-w-xl bg-white shadow-2xl border border-gray-400 p-5 lg:p-3 rounded-2xl">
  
                {/* <h2 className="text-4xl text-blue-600 text-center font-bold mb-4">¡Bienvenid@!</h2> */}
                <p className="text-center mt-3">Registra la información del deudor solidario para continuar con la solicitud</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-5 lg:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label htmlFor="first_surname" className="block text-sm font-medium">Primer apellido:</label>
                        <input type="text" {...register("first_surname")} id="first_lastname"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu primer apellido"/>

                        {errors.first_lastname && (
                            <span className="text-red-500 text-sm mt-2">{errors.first_lastname.message}</span>
                        )}

                    </div>

                    <div>
                        <label htmlFor="second_last_name" className="block text-sm font-medium">Segundo apellido:</label>
                        <input type="text" {...register("second_last_name")} id="second_lastname"
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="Ingresa tu segundo apellido"/>

                        {errors.second_lastname && (
                            <span className="text-red-500 text-sm mt-2">{errors.second_lastname.message}</span>
                        )}

                    </div>

                    <div className="col-span-2">
                        <label htmlFor="birthdate" className="block text-sm font-medium">Fecha de nacimiento:</label>
                        <input type="date" {...register("birthdate")} id="birthdate" min="1970-01-01" max="2004-12-31"
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
                            <option value="TPT"> Permiso de protección temporal</option>
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
                        <label htmlFor="expedition_location" className="block text-sm font-medium">Lugar de expedición:</label>
                        <select {...register("expedition_location")}
                            className="w-full border border-gray-300 mt-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300">
                            <option value="">Selecciona una ciudad</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.name}>{city.name}</option>
                            ))}
                        </select>


                        {errors.expedition_location && (
                            <span className="text-red-500 text-sm mt-2">{errors.expedition_location.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cellular" className="block text-sm font-medium">Celular:</label>
                        <input type="text" {...register("cellular")} id="cellular" maxLength={10} minLength={4}
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

                        {errors.nationality && (
                            <span className="text-red-500 text-sm mt-2">{errors.address.message}</span>
                        )}

                    </div>

                    <div className="md:col-span-2">
                        <button type="submit"
                            className="w-full bg-yellow-400 rounded-lg p-2 text-white font-semibold text-center hover:bg-yellow-500">
                            Enviar
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default DSForm;