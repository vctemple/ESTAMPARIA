import express from "express";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";
import { cadastroProduto, listProduto, detalheProduto, fotosProduto, deletarProduto, editarProduto, ativacaoProduto } from "../controllers/produtosController.js";
import formidable from "express-formidable";

//Cria o roteador http
const produtosRouter = express.Router();

//ROTAS
//Cadastro de produto com parsing de dados
produtosRouter.post("/", cadastroProduto);

//Retorna lista de produtos
produtosRouter.get("/", listProduto);

//Retorna o produto detalhado
produtosRouter.get("/dados/:pid", detalheProduto);

//Retorna as fotos do produto especificado
produtosRouter.get("/fotos/:pid", fotosProduto);

//Deleta produto especificado
produtosRouter.delete("/:pid", verificaTokenLogin, deletarProduto);

produtosRouter.put("/:pid", editarProduto);
produtosRouter.put("/ativacao/:pid", ativacaoProduto);

//Adicionar middleware de autenticação de perfil

export default produtosRouter;