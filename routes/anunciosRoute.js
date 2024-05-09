import express from "express";
import { cadastroAnuncio, listaAnuncioProduto, listaAnuncioProdutoComId, listAnuncios, detalheAnuncio, editarAnuncio } from "../controllers/anunciosController.js";

//Cria o roteador http
const anunciosRouter = express.Router();

//ROTAS
//Cadastro de anuncio com parsing de dados
anunciosRouter.post("/cadastroAnuncio", cadastroAnuncio);

anunciosRouter.get("/", listAnuncios);
anunciosRouter.get("/:pid", detalheAnuncio);

anunciosRouter.put("/editar/:pid", editarAnuncio);

anunciosRouter.post("/home", listaAnuncioProduto);

anunciosRouter.post("/estampa/:pid", listaAnuncioProdutoComId);

export default anunciosRouter;