import express from "express";
import { cadastroPedido, listPedidosDeUsuario, listPedidosFinalizados, getFrete, finalizarPagamento, detalhePedido, listTodosPedidos } from "../controllers/pedidosController.js";

//Cria o roteador http
const pedidosRouter = express.Router();

pedidosRouter.post("/", cadastroPedido);
pedidosRouter.post("/frete", getFrete);

pedidosRouter.post("/finalizarPagamento", finalizarPagamento);

pedidosRouter.get("/detalhe/:pid", detalhePedido);
pedidosRouter.get("/pedidoUsuario/:pid", listPedidosDeUsuario);
pedidosRouter.post("/pedidosFinalizados", listPedidosFinalizados);
pedidosRouter.post("/todosPedidos", listTodosPedidos);

export default pedidosRouter;