import Vehiculo from "../models/vehiculos.js";
import { Types } from "mongoose";
import Reserva from "../models/reservas.js"; 

const registrarVehiculo = async ( req , res ) => {
    const { placa } = req.body;

    if ( Object.values(req.body).includes("")) return res.status(400).json({ res : "Rellene todos los campos por favor"});

    const existeVehiculo = await Vehiculo.findOne({ placa });

    if ( existeVehiculo ) return res.status( 400 ).json({ res: "ERROR!! El vehiculo ya se encuentra registrado"});

    const vehiculo = new Vehiculo(req.body);

    await vehiculo.save();

    res.json({ res: "vehiculo registrado con exito" });
}

const listarvehiculos = async ( req , res ) => {
    res.status( 200 ).json( await Vehiculo.find().select("-createdAt -updatedAt -__v"));
}

const detallevehiculo = async ( req , res ) => {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findById( id ).select("-createdAt -updatedAt -__v");

    const reserva = await Reserva.find().where('vehiculo').equals( id ).populate("cliente", "_id cedula nombre apellido email telefono").populate("vehiculo", "_id marca modelo placa").select("-createdAt -updatedAt -__v"); 

    if ( !vehiculo ) return res.status(404).json({ res: "ERROR!!, vehiculo no encontrado"});

    res.status(200).json({ vehiculo , reserva });
}

const actualizarvehiculo = async ( req , res ) => {
    const { id } = req.params;
    
    if ( !Types.ObjectId.isValid( id )) return res.status(400).json({ res: `ID ${ id } no valido`});

    if ( Object.values( req.body ).includes("")) return res.status(400).json({ res: "Por favor rellene todos los campos"});

    await Vehiculo.findByIdAndUpdate( id , req.body );

    res.status(200).json({ res : "vehiculo actualizado con exito"});
}

const eliminarvehiculo = async ( req , res ) => {
    const { id } = req.params;

    if ( !Types.ObjectId.isValid( id )) return res.status(404).json({ res: `ID ${id} no valido`});

    await Vehiculo.findByIdAndDelete( id );

    res.status( 200 ).json({ res: "vehiculo eliminado con exito"});
}

export { 
    registrarVehiculo,
    listarvehiculos,
    detallevehiculo,
    actualizarvehiculo,
    eliminarvehiculo
};