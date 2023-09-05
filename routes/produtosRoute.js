import express from "express";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";
import { cadastroController } from "../controllers/produtosController.js";
import formidable from "express-formidable";

//Cria o roteador http
const produtosRouter = express.Router();

//ROTAS
//Cadastro de produto com parsing de dados
produtosRouter.post("/cadastro", verificaTokenLogin, formidable(), cadastroController);

//Adicionar middleware de autenticação de perfil

export default produtosRouter;