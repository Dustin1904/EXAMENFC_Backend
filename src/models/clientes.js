import { Schema, model } from "mongoose";

const clientesSchema = new Schema({
    cedula: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    ciudad: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
    },
    telefono: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    fecha_nacimiento: {
        type: Date,
        required: true,
    }   
}, {
    timestamps: true,
});

export default model("Cliente", clientesSchema);