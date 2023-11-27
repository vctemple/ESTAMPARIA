import express from "express";
import {
  cadastroController,
  loginController,
  listarUsuarios,
  ativacaoUsuario,
  deletarUsuario,
  detalheUsuario,
  editarDadosUsuario,
  editarSenha
} from "../controllers/authController.js";
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

authRouter.get("/usuarios", listarUsuarios);

authRouter.put("/ativacao/:pid", ativacaoUsuario);

authRouter.put("/delete/:pid", deletarUsuario);

authRouter.get("/detalhe/:pid", detalheUsuario);

authRouter.put("/editarDados/:pid", editarDadosUsuario);

authRouter.put("/editarSenha/:pid", editarSenha);

// authRouter.get("/auth-adm", verificaTokenLogin, verificaPerfilAdmin, (req, res) => {
//     res.status(200).send({ ok: true });
// });

export default authRouter;
