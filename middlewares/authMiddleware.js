import JWT from "jsonwebtoken";
import usuariosModel from "../Models/usuariosModel.js";

//Verificação das rotas por token de acesso
export const verificaTokenLogin = async (req, res, next) => {
  try {
    const decoded = JWT.verify(req.headers.authorization, process.env.SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({
      success: false,
      e,
    });
  }
};

//Verificação do perfil de acesso Admin
export const verificaPerfilAdmin = async (req, res, next) => {
  try {
    const dadosUsuario = await usuariosModel.findById(req.usuario._id);
    if (dadosUsuario.perfil !== 1) {
      return res.status(401).send({
        success: false,
        message: "Acesso negado!",
      });
    }
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no servidor!",
    });
  }
};

//Verificação do perfil de acesso Gerente
export const verificaPerfilGerenteAdmin = async (req, res, next) => {
  try {
    const dadosUsuario = await usuariosModel.findById(req.usuario._id);
    if (dadosUsuario.perfil !== 2 && dadosUsuario.perfil !== 1) {
      return res.status(401).send({
        success: false,
        message: "Acesso negado!",
      });
    }
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no servidor!",
    });
  }
};

