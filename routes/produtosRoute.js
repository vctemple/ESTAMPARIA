import express from "express";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";
import {
  cadastroSKU,
  listProduto,
  listProdutoAtivo,
  detalheSKU,
  detalheEstampa,
  fotosProduto,
  deletarProduto,
  editarSKU,
  ativacaoSKU,
  ativacaoEstampa,
  filtraProdutos,
  cadastroEstampa,
  listaEstampa,
  editarEstampa,
} from "../controllers/produtosController.js";
import formidable from "express-formidable";

//Cria o roteador http
const produtosRouter = express.Router();

//ROTAS
//Cadastro de produto com parsing de dados
produtosRouter.put("/cadastroSKU/:pid", cadastroSKU);
produtosRouter.post("/cadastroEstampa", cadastroEstampa);

//Retorna lista de produtos
produtosRouter.get("/", listProduto);

produtosRouter.get("/listaEstampa", listaEstampa);

produtosRouter.get("/ativo", listProdutoAtivo);

//Retorna o produto detalhado
produtosRouter.get("/dados/sku/:pid", detalheSKU);

produtosRouter.get("/dados/estampa/:pid", detalheEstampa);

//Retorna as fotos do produto especificado
produtosRouter.get("/fotos/:pid", fotosProduto);

//Deleta produto especificado
produtosRouter.delete("/:pid", verificaTokenLogin, deletarProduto);

//Edição de produto
produtosRouter.put("/editarSKU/:pid", editarSKU);
produtosRouter.put("/ativacaoSKU/:sku", ativacaoSKU);
produtosRouter.put("/ativacaoEstampa/:pid", ativacaoEstampa);
produtosRouter.put("/editarEstampa/:pid", editarEstampa);

//Filtrar produtos na home
produtosRouter.post("/filtro", filtraProdutos);

//Adicionar middleware de autenticação de perfil

export default produtosRouter;
