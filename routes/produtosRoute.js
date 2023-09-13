import express from "express";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";
import { cadastroProduto, listProduto, detalheProduto, fotosProduto, deletarProduto } from "../controllers/produtosController.js";
import formidable from "express-formidable";

//Cria o roteador http
const produtosRouter = express.Router();

//ROTAS
//Cadastro de produto com parsing de dados
produtosRouter.post("/", verificaTokenLogin, formidable(), cadastroProduto);

//Retorna lista de produtos
produtosRouter.get("/", listProduto)

//Retorna o produto detalhado
produtosRouter.get("/dados/:nome", detalheProduto);

//Retorna as fotos do produto especificado
produtosRouter.get("/fotos/:pid", fotosProduto);

//Deleta produto especificado
produtosRouter.delete("/:pid", deletarProduto)

//Adicionar middleware de autenticação de perfil

export default produtosRouter;