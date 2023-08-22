import express from "express";
import { cadastroController, loginController} from "../controllers/authController.js";
import { verificaTokenLogin } from "../middlewares/authMiddleware.js";

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

// authRouter.get("/auth-adm", verificaTokenLogin, verificaPerfilAdmin, (req, res) => {
//     res.status(200).send({ ok: true });
// });



export default authRouter;