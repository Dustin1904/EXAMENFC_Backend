import verificarAutenticacion from "../middlewares/auth.js";
import { Router } from "express";
import { registrarVehiculo , listarvehiculos , detallevehiculo , actualizarvehiculo , eliminarvehiculo } from "../controllers/vehiculos_controller.js";

const router = Router();

router.post("/vehiculos/registro", verificarAutenticacion, registrarVehiculo);
router.get("/vehiculos", verificarAutenticacion, listarvehiculos);
router.get("/vehiculos/:id", verificarAutenticacion, detallevehiculo);
router.put("/vehiculos/:id", verificarAutenticacion, actualizarvehiculo);
router.delete("/vehiculos/:id", verificarAutenticacion, eliminarvehiculo);

export default router;