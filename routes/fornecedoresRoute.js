import express from "express";
import { cadastroFornecedor } from "../controllers/fornecedoresController.js";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";

//Cria o roteador http
const fornecedoresRouter = express.Router();

//ROTAS
//Cadastro de fornecedor
fornecedoresRouter.post("/cadastro", verificaTokenLogin, cadastroFornecedor);

//Adicionar middleware de autenticação de perfil

export default fornecedoresRouter;