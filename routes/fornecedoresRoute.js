import express from "express";
import { cadastroFornecedor, listFornecedores, detalheFornecedor, editarFornecedor, deletarFornecedor } from "../controllers/fornecedoresController.js";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";

//Cria o roteador http
const fornecedoresRouter = express.Router();

//ROTAS
//Cadastro de fornecedor
fornecedoresRouter.post("/cadastro", cadastroFornecedor);

//Listar fornecedores
fornecedoresRouter.get("/", listFornecedores);

//Detalhar fornecedor
fornecedoresRouter.get("/dados/:pid", detalheFornecedor);

//Editar fornecedor
fornecedoresRouter.put("/:pid", editarFornecedor);

//Deletar fornecedor
fornecedoresRouter.put("/delete/:pid", deletarFornecedor);

//Adicionar middleware de autenticação de perfil

export default fornecedoresRouter;