import { Schema, model, Types } from "mongoose";

const vehiculosSchema = new Schema({
    marca: {
        type: String,
        require: true,
        trim: true,
    },
    modelo: {
        type: String,
        require: true,
        trim: true,
    },
    placa: {
        type: String,
        require: true,
        trim: true
    },
    anio_fabricacion: {
        type: Number,
        require: true,
    },
    tipo_vehiculo: {
        type: String,
        enum: ["Automóvil","Camión","Bus","Camioneta"],
        require: true,
    },
    kilometraje: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    color: {
        type: String,
        require: true,
        unique: true,
    }
},
{
    timestamps: true,
});

export default model("Vehiculo", vehiculosSchema);
