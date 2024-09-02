import { Router } from "express";

import verificarAutenticacion from "../middlewares/auth.js";
import {
    actualizarCliente,
    detalleCliente,
    eliminarCliente,
    listarClientes,
    registrarCliente,
    //logincliente,
    //perfilcliente,
} from "../controllers/clientes_controller.js";

const router = Router();

router.post("/clientes/registro", verificarAutenticacion, registrarCliente);
//router.post("/clientes/login", logincliente);
//router.get("/cliente/perfil", verificarAutenticacion, perfilcliente);
router.get("/clientes", verificarAutenticacion, listarClientes);
router.get("/clientes/:id", verificarAutenticacion, detalleCliente);
router.put("/clientes/:id", verificarAutenticacion, actualizarCliente);
router.delete("/clientes/:id", verificarAutenticacion, eliminarCliente);

export default router;