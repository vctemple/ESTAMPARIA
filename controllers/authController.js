import usuariosModel from "../Models/usuariosModel.js";
import { hashSenha, compararSenha } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//ROTINA DE CADASTRO
export const cadastroController = async (req, res) => {
  try {
    const {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      senha,
      cep,
      endereco,
      numEnd,
      bairro,
      complementoEnd,
      cidade,
      estado,
      perfil,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!nome) return res.send({ message: "Nome é obrigatório!" });
    if (!email) return res.send({ message: "E-mail é obrigatório!" });
    if (!cpf) return res.send({ message: "CPF é obrigatório!" });
    if (!dataNascimento)
      return res.send({ message: "Data de nascimento é obrigatório!" });
    if (!telefone) return res.send({ message: "Telefone é obrigatório!" });
    if (!senha) return res.send({ message: "Senha é obrigatório!" });
    if (!cep) return res.send({ message: "CEP é obrigatório!" });
    if (!endereco) return res.send({ message: "Endereço é obrigatório!" });
    if (!numEnd) return res.send({ message: "Número é obrigatório!" });
    if (!bairro) return res.send({ message: "Bairro é obrigatório!" });
    if (!cidade) return res.send({ message: "Cidade é obrigatório!" });
    if (!estado) return res.send({ message: "Estado é obrigatório!" });

    //Checagem de existência de usuário
    const cpfExistente = await usuariosModel.findOne({ cpf });
    const emailExistente = await usuariosModel.findOne({ email });
    if (cpfExistente || emailExistente) {
      return res.status(200).send({
        success: false,
        message: "Usuário já cadastrado!",
      });
    }

    //Criptografia da senha
    const cryptSenha = await hashSenha(senha);

    //Registro no banco
    const usuarioNovo = await new usuariosModel({
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      senha: cryptSenha,
      cep,
      endereco,
      numEnd,
      bairro,
      complementoEnd,
      cidade,
      estado,
      perfil,
    }).save();

    res.status(201).send({
      success: true,
      message: "Usuário criado com sucesso!",
      usuarioNovo, //checar a relevância posteriormente!
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};

//ROTINA DE LOGIN
export const loginController = async (req, res) => {
  try {
    //Validações
    const { email, senha } = req.body;
    if (!email) return res.send({ message: "E-mail é obrigatório!" });
    if (!senha) return res.send({ message: "Senha é obrigatório!" });

    //Checagem de existência de usuário e conta existente
    const usuario = await usuariosModel.findOne({ email });
    if (!usuario) {
      return res.status(404).send({
        success: false,
        message: "Email não encontrado!",
      });
    }
    if (usuario.deletado || !usuario.ativo) {
      return res.status(404).send({
        success: false,
        message: "Conta deletada ou inativa!",
      });
    }

    //Comparação de senhas
    const matchSenha = await compararSenha(senha, usuario.senha);
    if (!matchSenha) {
      return res.status(200).send({
        success: false,
        message: "Senha inválida!",
      });
    }

    //Criação do token
    const token = await JWT.sign({ _id: usuario.id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({
      success: true,
      message: "Login com sucesso!",
      usuario: {
        _id: usuario._id,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no login",
    });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel
      .find({ deletado: false })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Lista de usuários",
      total: usuarios.length,
      usuarios,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro na listagem",
      error: e.message,
    });
  }
};

export const ativacaoUsuario = async (req, res) => {
  try {
    const statusUsuario = req.body.ativo ? false : true;
    const usuario = await usuariosModel.findByIdAndUpdate(
      req.params.pid,
      { ativo: statusUsuario },
      { new: true }
    );

    //registro no banco
    await usuario.save();
    res.status(201).send({
      success: true,
      message: "Alterado com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

//DELETAR USUÁRIO
//São sobreescritas as informações de cadastro do usuário e o mesmo desativado do sistema
export const deletarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosModel.findByIdAndUpdate(
      req.params.pid, //Email e Cpf por serem indexados e senha por questão de segurança recebem a data atual em milissegundos para não haver conflito
      {
        nome: null,
        email: Date.now(),
        cpf: Date.now(),
        dataNascimento: null,
        telefone: null,
        senha: Date.now(),
        cep: null,
        endereco: null,
        numEnd: null,
        bairro: null,
        complementoEnd: null,
        cidade: null,
        estado: null,
        ativo: false,
        deletado: true,
        imagem: null,
      },
      { new: true }
    );

    //registro no banco
    await usuario.save();
    res.status(201).send({
      success: true,
      message: "Usuário deletado!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

//DETALHAR USUARIO
export const detalheUsuario = async (req, res) => {
  try {
    const usuario = await usuariosModel.findById(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Usuário detalhado",
      usuario,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao detalhar",
      error: e.message,
    });
  }
};

//EDITAR USUARIO
export const editarDadosUsuario = async (req, res) => {
  try {
    const {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      cep,
      endereco,
      numEnd,
      bairro,
      complementoEnd,
      cidade,
      estado,
      imagem,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!nome) return res.send({ message: "Nome é obrigatório!" });
    if (!email) return res.send({ message: "E-mail é obrigatório!" });
    if (!cpf) return res.send({ message: "CPF é obrigatório!" });
    if (!dataNascimento)
      return res.send({ message: "Data de nascimento é obrigatório!" });
    if (!telefone) return res.send({ message: "Telefone é obrigatório!" });
    if (!cep) return res.send({ message: "CEP é obrigatório!" });
    if (!endereco) return res.send({ message: "Endereço é obrigatório!" });
    if (!numEnd) return res.send({ message: "Número é obrigatório!" });
    if (!bairro) return res.send({ message: "Bairro é obrigatório!" });
    if (!cidade) return res.send({ message: "Cidade é obrigatório!" });
    if (!estado) return res.send({ message: "Estado é obrigatório!" });

    //criação do objeto
    const usuario = await usuariosModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.body },
      { new: true }
    );

    //registro no banco
    await usuario.save();
    res.status(201).send({
      success: true,
      message: "Usuário editado com sucesso!",
      usuario,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

export const editarSenha = async (req, res) => {
  try {
    const usuario = await usuariosModel.findById(req.params.pid)
    
    const {
      senhaAntiga,
      senhaNova
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!senhaAntiga) return res.send({ message: "Senha Antiga é obrigatório" });
    if (!senhaNova) return res.send({ message: "Nova senha é obrigatório!" });
 
    const matchSenha = await compararSenha(senhaAntiga, usuario.senha);
    if (!matchSenha) {
      return res.status(200).send({
        success: false,
        message: "Senha inválida!",
      });
    }

    const cryptSenha = await hashSenha(senhaNova);
    usuario.senha = cryptSenha;
    await usuario.save();
    res.status(201).send({
      success: true,
      message: "Senha alterada com sucesso!",
      usuario,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao alterar senha",
    });
  }
};
