import { Schema, model } from 'mongoose'

const reservaSchema = new Schema({
    codigo: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    vehiculo: {
        type: Schema.Types.ObjectId,
        ref: 'Vehiculo',
        trim: true,
        default: null
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        trim: true,
        default: null
    }
}, {
    timestamps:true
})

export default model('Reserva', reservaSchema);