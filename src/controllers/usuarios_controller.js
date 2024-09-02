import mongoose from "mongoose"
//import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarToken from "../helpers/crearJWT.js"
import Usuario from "../models/usuarios.js"


const registro = async (req, res) => {
    const { email , password } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    if (await Usuario.findOne({ email })) return res.status(400).json({ res: 'El email ya se encuentra registrado' })
    
    const nuevoUsuario = new Usuario(req.body)
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
    //await nuevoVeterinario.crearToken()
    //sendMailToUser(email, nuevoVeterinario.token)
    await nuevoUsuario.save()

    res.status(201).json({ res: 'Registro exitoso' })
}

// const confirmEmail = async (req, res) => {
//     if(!(req.params.token)) return res.status(400).json({ res: "Lo sentimos, no se puede validar la cuenta" })
    
//     const usuarioBDD = await Veterinario.findOne({ token: req.params.token })
        
//     if(!usuarioBDD?.token) return res.status(404).json({ res: "La cuenta ya ha sido confirmada" })
        
//     usuarioBDD.token = null
//     usuarioBDD.confirmEmail = true
        
//     await usuarioBDD.save()
    
//     res.status(200).json({ res: "Token confirmado, ya puedes iniciar sesión" }) 
// }

const login = async (req, res) => {
    const { email , password } = req.body
    if (Object.values(req.body).includes('')) return res.status(404).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })
    
    const usuarioBDD = await Usuario.findOne({ email }).select('-status -__v -createdAt -updatedAt')

    if (!usuarioBDD) return res.status(404).json({ res: 'El email no se encuentra registrado' })

    //if (usuarioBDD?.confirmEmail === false) return res.status(403).json({ res: 'Confirme su email para poder iniciar sesión' })

    const verificarPassword = await usuarioBDD.matchPassword(password)

    if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

    const token = generarToken(usuarioBDD._id)
    const { _id, nombre, apellido } = usuarioBDD

    res.status(200).json({ res: 'Login exitoso', _id, nombre, apellido, token })
}

// const recuperarPassword = async (req, res) => {
//     const { email } = req.body

//     if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

//     const usuarioBDD = await Veterinario.findOne({ email })

//     if (!usuarioBDD) return res.status(404).json({ res: 'El email no se encuentra registrado' })

//     await usuarioBDD.crearToken()

//     sendMailToRecoveryPassword(email, usuarioBDD.token)

//     await usuarioBDD.save()

//     res.status(200).json({ res: 'Correo enviado, revise su bandeja de entrada' })
// }

// const comprobarTokenPasword = async (req, res) => {
//     if (!req.params.token) return res.status(400).json({ res: 'Token no encontrado' })

//     const usuarioBDD = await Veterinario.findOne({ token: req.params.token })

//     if (usuarioBDD?.token !== req.params.token) return res.status(404).json({ res: 'Token no válido' })

//     await usuarioBDD.save()

//     res.status(200).json({ res: 'Token confirmado, puede cambiar su contraseña' })
// }

// const nuevoPassword = async (req, res) => {
//     const { password, confirmPassword } = req.body

//     if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

//     if (password !== confirmPassword) return res.status(400).json({ res: 'Las contraseñas no coinciden' })

//     const usuarioBDD = await Veterinario.findOne({ token: req.params.token })

//     if (usuarioBDD?.token !== req.params.token) return res.status(404).json({ res: 'Token no válido nuevo password' })

//     usuarioBDD.token = null
//     usuarioBDD.password = await usuarioBDD.encryptPassword(password)

//     await usuarioBDD.save()

//     res.status(200).json({ res: 'Felicidades, su contraseña ha sido actualizada' })
// }

const perfil = (req, res) => {
    if (!req.usuarioBDD) return res.status(404).json({ res: 'No se encuentra el usuario, inicie sesión nuevamente' })
    
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v

    res.status(200).json(req.usuarioBDD)
}

const listarUsuarios = async (_, res) => {
    res.status(200).json(await Usuario.find().select('-password -createdAt -updatedAt -__v'))
}

const detalleUsuario = async ( req , res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ res: `ID ${id} no válido` })

    const usuarioBDD = await Usuario.findById(id).select('-password')

    res.status(200).json(usuarioBDD)
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ res: `ID ${id} no válido` })
    
    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    const usuarioBDD = await Usuario.findById(id)
    
    if(!usuarioBDD) return res.status(404).json({ res: `No existe el usuario ${id}` })
    
    if (usuarioBDD.email != req.body.email) {
        const usuarioBDDMail = await Usuario.findOne({ email: req.body.email })
        if (usuarioBDDMail) return res.status(404).json({ res: 'El email ya se encuentra registrado'})  
    }

	usuarioBDD.nombre = req.body.nombre || usuarioBDD?.nombre
    usuarioBDD.apellido = req.body.apellido  || usuarioBDD?.apellido
    usuarioBDD.email = req.body.email || usuarioBDD?.email
    
    await usuarioBDD.save()
    
    res.status(200).json({ res: 'Perfil actualizado correctamente'})
}

const actualizarPassword = async (req, res) => {
    const usuarioBDD = await Usuario.findById(req.usuarioBDD._id)

    const verificarPassword = await usuarioBDD.matchPassword(req.body.password)

    if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

    usuarioBDD.password = await usuarioBDD.encryptPassword(req.body.newPassword)

    await usuarioBDD.save()

    res.status(200).json({ res: 'Contraseña actualizada' })
}

export {
    login,
    perfil,
    registro,
    //confirmEmail,
    listarUsuarios,
    detalleUsuario,
    actualizarPerfil,
    actualizarPassword,
	// recuperarPassword,
    // comprobarTokenPasword,
	// nuevoPassword
}