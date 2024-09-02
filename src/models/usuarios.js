import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
    },
    apellido: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
});

usuarioSchema.methods.encryptPassword = async (password) => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
}

usuarioSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// usuarioSchema.methods.crearToken = function() {
//     this.token = Math.random().toString(36).slice(2);
// }

export default model("Usuario", usuarioSchema);
