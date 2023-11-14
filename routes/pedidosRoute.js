import express from "express";
import { cadastroPedido, listPedidosDeUsuario, listPedidos } from "../controllers/pedidosController.js";

//Cria o roteador http
const pedidosRouter = express.Router();

pedidosRouter.post("/", cadastroPedido);

pedidosRouter.get("/:pid", listPedidosDeUsuario);
pedidosRouter.get("/", listPedidos)

export default pedidosRouter;