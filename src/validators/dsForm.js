import * as Yup from "yup";
import { differenceInYears }  from "date-fns"

export const dsFormSchema = Yup.object().shape({
   first_name: Yup.string()
                  .required("El primer nombre es obligatorio"),
 
   second_name: Yup.string(),
 
   first_lastname: Yup.string()
                      .required("El primer apellido es obligatorio"),
 
   second_lastname: Yup.string(),

   email: Yup.string()
               .required("El correo es obligatorio")
               .email("Correo inválido"),

   document_type: Yup.string()
                     .required("El tipo de documento es obligatorio"),

   document_number: Yup.string()
                        .required("El número de documento es obligatorio"),

   cellular: Yup.string()
               .required("El celular es obligatorio")
               .matches(/^\d+$/, "Solo números")
               .length(10, "Minimo 10 digitos"),

   birthdate: Yup.string()
                  .required("La fecha de nacimiento es obligatoria"),

   nationality: Yup.string()
                     .required("Selecciona una nacionalidad"),

   expedition_date: Yup.string()
                        .required("La fecha de expedición es obligatoria"),

   address: Yup.string()
               .required("La dirección es obligatoria"),

   city: Yup.string()
            .required("Selecciona una ciudad"),

   gender: Yup.string()
               .required("Selecciona un género"),

});
