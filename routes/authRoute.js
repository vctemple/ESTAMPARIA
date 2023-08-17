import express from "express";
import { cadastroController, loginController, testeController} from "../controllers/authController.js";
import { verificaPerfilGerenteAdmin, verificaPerfilAdmin, verificaTokenLogin } from "../middlewares/authMiddleware.js";

//Cria o roteador http
const authRouter = express.Router();

//ROTAS
//Cadastro de usuário
authRouter.post("/cadastro", cadastroController);

//Login de acesso
authRouter.post("/login", loginController);

//Autenticação de login
authRouter.get("/auth-login", verificaTokenLogin, (req, res) => {
    res.status(200).send({ ok: true });
});

//teste
authRouter.get("/testeAdmin", verificaTokenLogin, verificaPerfilAdmin, testeController);
authRouter.get("/testeGerenteAdmin", verificaTokenLogin, verificaPerfilGerenteAdmin, testeController);

export default authRouter;