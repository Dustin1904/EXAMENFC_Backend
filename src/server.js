import express from "express";
import cors from "cors";
import routerUsuarios from "./routes/usuario.routes.js";
import routerClientes from "./routes/cliente.routes.js";
import routerVehiculos from "./routes/vehiculos.routes.js";
import routerReserva from "./routes/reserva.routes.js"
import "dotenv/config";
import morgan from "morgan";
import { createServer } from "http";

const app = express();
app.use(morgan("dev"));

app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());

app.get("/", (_, res) => res.send("Server on"));

app.use("/api", routerUsuarios);
app.use("/api", routerClientes);
app.use("/api", routerVehiculos);
app.use("/api", routerReserva);
app.use((_, res) => res.status(404).json({ res: "404 - Endpoint not found" }));

const server = createServer(app);

export default server;
