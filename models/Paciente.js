import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,  // Aqui estamos haciendo la relacionn de paciente veterinario con el id del veterinario
        ref: "Veterinario", // este es el modelo del veterinario
    }
}, {
    timestamps: true
});

const Paciente = mongoose.model("Paciente", pacientesSchema);
export default Paciente;