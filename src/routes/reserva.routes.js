import { Router } from "express";
import {
    registrarReserva,
    listarReserva,
    detalleReserva,
    actualizarReserva,
    eliminarReserva
} from "../controllers/reserva_controller.js";
import verificarAutenticacion from "../middlewares/auth.js";

const router = Router();

router.post('/reservas/registro', verificarAutenticacion, registrarReserva)

router.get('/reservas', listarReserva)

//router.patch('/Reserva/estado/:id', verificarAutenticacion, cambiarEstado)

router
    .route('/reservas/:id')
    .get(verificarAutenticacion, detalleReserva)
    .delete(verificarAutenticacion, eliminarReserva)
    
    
router.put('/reservas',verificarAutenticacion, actualizarReserva)
export default router