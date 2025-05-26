export const nationalities = [
    "Argentina",
    "Bolivia",
    "Brasil",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Ecuador",
    "El Salvador",
    "España",
    "Guatemala",
    "Honduras",
    "México",
    "Nicaragua",
    "Panamá",
    "Paraguay",
    "Perú",
    "Puerto Rico",
    "República Dominicana",
    "Uruguay",
    "Venezuela"
];

export const checkAge = async (birthdate) => {
    try {
        if (!birthdate) throw new Error("La fecha de nacimiento es requerida");

        const birth = new Date(birthdate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--; // todavía no ha cumplido años este año
        }

        return age;

    } catch (error) {
        console.error("❌ Error en findPersonAgeByBirthDate:", error.message);
        throw error;
    }
}


export const formatCurrency = (value) => {
    if (!value) return '';
    const number = parseInt(value);
    if (isNaN(number)) return '';
    return number.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    });
};