//import { sendMailToPaciente } from '../config/nodemailer.js';
import generarToken from '../helpers/crearJWT.js';
import Cliente from '../models/clientes.js';
//import Tratamiento from '../models/tratamiento.js';
//import Veterinario from '../models/veterinario.js';
import { Types } from 'mongoose';
import Reserva from "../models/reservas.js";

const registrarCliente = async (req, res) => {
    const { email } = req.body;

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    const verificarEmailBDD = await Cliente.findOne({ email }) /*|| await Veterinario.findOne({ email })*/

    if (verificarEmailBDD) return res.status(400).json({ res: 'El email ya se encuentra registrado' })

    const nuevoCliente = new Cliente(req.body)

    //const password = `vet${Math.random().toString(36).slice(2)}`
    //nuevoCliente.password = await nuevoPaciente.encryptPassword(password)
    //nuevoCliente.veterinario = req.veterinarioBDD._id

    //await sendMailToPaciente(nuevoPaciente.email, password)
    await nuevoCliente.save()

    res.status(201).json({ res: 'Cliente registrado correctamente' })
};

// const loginPaciente = async (req, res) => {
//     const { email, password } = req.body;

//     if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })
    
//     const pacienteBDD = await Paciente.findOne({ email })

//     if (!pacienteBDD) return res.status(404).json({ res: 'Email no registrado' })

//     const verificarPassword = await pacienteBDD.matchPassword(password)

//     if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

//     const token = generarToken(pacienteBDD._id, 'paciente')

//     const { nombre, propietario, celular, convencional, _id } = pacienteBDD

//     res.status(200).json({ token, _id, nombre, propietario, email, celular, convencional, rol: 'paciente' })
// };

// const perfilPaciente = (req, res) => {

//     delete req.pacienteBDD.password
//     delete req.pacienteBDD.createdAt
//     delete req.pacienteBDD.updatedAt
//     delete req.pacienteBDD.__v

//     req.pacienteBDD.rol = 'paciente'

//     res.status(200).json(req.pacienteBDD)
// };

const listarClientes = async (req, res) => {

    /*if (req.pacienteBDD && "propietario" in req.pacienteBDD) {
        res.status(200).json(await Paciente.find(req.pacienteBDD._id).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido'))
    } else {*/
        res.status(200).json(await Cliente.find().select("-createdAt -updatedAt -__v"))
    //}

};

const detalleCliente = async (req, res) => {
    const { id } = req.params
    
    const cliente = await Cliente.findById(id).select('-createdAt -updatedAt -__v')

    const reserva = await Reserva.find().where('cliente').equals(id).populate("cliente", "_id cedula nombre apellido email telefono").populate("vehiculo", "_id modelo placa").select("-createdAt -updatedAt -__v")

    if (!cliente) return res.status(404).json({ res: 'Cliente no encontrado' })

    res.status(200).json({ cliente, reserva })
};

const actualizarCliente = async (req, res) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ res: `ID ${id} no válido` })

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    await Cliente.findByIdAndUpdate(id, req.body)

    res.status(200).json({ res: 'Cliente actualizado correctamente' })
};

const eliminarCliente = async (req, res) => {
    const { id } = req.params

    if( !Types.ObjectId.isValid(id) ) return res.status(404).json({ res: `ID ${id} no válido`})

    //await Paciente.findByIdAndUpdate(id, { salida: Date.now(), estado: false })
    await Cliente.findByIdAndDelete( id )

    res.status(200).json({ res: 'Cliente eliminado correctamente' })
};

export {
    //loginPaciente,
    //perfilPaciente,
    listarClientes,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente,
};