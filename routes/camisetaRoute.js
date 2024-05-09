import express from "express";
import { cadastroCamiseta, getCamiseta, listCamisetas, editarCamiseta } from "../controllers/camisetaController.js";

//Cria o roteador http
const camisetaRouter = express.Router();

camisetaRouter.post("/cadastrarCamiseta", cadastroCamiseta);
camisetaRouter.get("/getCamiseta/:pid", getCamiseta);
camisetaRouter.get("/listaCamisetas", listCamisetas);
camisetaRouter.put("/editarCamiseta/:pid", editarCamiseta);

export default camisetaRouter;