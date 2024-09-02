import Reserva from "../models/reservas.js";
import mongoose, { Types } from "mongoose";
import Vehiculo from "../models/vehiculos.js";
import Cliente from "../models/clientes.js";

const registrarReserva = async (req, res) => {
	const { vehiculo , cliente } = req.body;

	const vehiculoEncontrado = await Vehiculo.findOne({placa:vehiculo});
	const clienteEncontrado = await Cliente.findOne({cedula:cliente});

	if (!vehiculoEncontrado)
		return res
			.status(404)
			.json({ res: `No existe el vehiculo con la placa ${ vehiculo }` });

	if (!clienteEncontrado)
		return res
			.status(404)
			.json({ res: `No existe el cliente con la cedula ${ cliente }`});

	const codigo =  Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

	req.body.codigo = codigo;
	req.body.vehiculo=vehiculoEncontrado._id;
	req.body.cliente=clienteEncontrado._id;

	const vehiculoNuevo = await Reserva.create(req.body);

	res
		.status(201)
		.json({
			res: `Registro exitoso del Reserva ${vehiculoNuevo._id}`
		});
};

const listarReserva = async ( req , res ) => {
	const reserva = await Reserva.find().populate('cliente', "nombre apellido cedula").populate('vehiculo' , "placa modelo").select("-__v -createdAt -updatedAt");
	console.log(reserva);
	
	// Reserva.cliente = Reserva.cliente.nombre + " " + Reserva.cliente.apellido;
	// Reserva.tecnico = Reserva.tecnico.nombre + " " + Reserva.tecnico.apellido;

	res.status(200).json(reserva);
};

const detalleReserva = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid( id ))
		return res
			.status(404)
			.json({ res: `No existe la Reserva con el id ${ id }` });

	res
		.status(200)
		.json(
			await Reserva.findById( id ).populate("cliente", "_id cedula nombre apellido email telefono").populate("vehiculo", "_id placa modelo anio_fabricacion color kilometraje descripcion").select("-createdAt -updatedAt -__v")
		);
};

const actualizarReserva = async (req, res) => {
	const { cliente , vehiculo } = req.body;

	const clienteEncontrado = await Cliente.findOne({ cedula: cliente })
	const vehiculoEncontrado = await Vehiculo.findOne({ placa: vehiculo })
	console.log(clienteEncontrado);
	console.log(vehiculoEncontrado);
	
	if ( !clienteEncontrado || !vehiculo ) {
		return res 
		.status(404)
		.json({ res: "No existe el cliente o el vehiculo con los datos proporcionados" });
	}
	
	req.body.cliente = clienteEncontrado._id
	req.body.vehiculo = vehiculoEncontrado._id
	
	await Reserva.findByIdAndUpdate(req.body._id , req.body);
	console.log(req.body);
	

	res.status(200).json({ res: `Reserva actualizada` });
};

const eliminarReserva = async (req, res) => {
	await Reserva.findByIdAndDelete(req.params.id);

	res.status(200).json({ res: `Reserva ${req.params.id} eliminada` });
};

// const cambiarEstado = async (req, res) => {
// 	const { id } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(id))
// 		return res
// 			.status(404)
// 			.json({ res: `No existe el tratamiento con el id ${id}` });

// 	await Tratamiento.findByIdAndUpdate(id, { estado: false });

// 	res.status(200).json({ res: `Estado del tratamiento ${id} cambiado` });
// };

export {
	listarReserva,
	detalleReserva,
	actualizarReserva,
	eliminarReserva,
	registrarReserva
};
