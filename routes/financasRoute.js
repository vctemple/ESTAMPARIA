import express from "express";
import { inserirValor, listarMovimento } from "../controllers/financasController.js";

//Cria o roteador http
const financasRouter = express.Router();

//ROTAS
//Cadastro de anuncio com parsing de dados
financasRouter.post("/inserirValor", inserirValor);
financasRouter.post("/", listarMovimento);

export default financasRouter;