import usuariosModel from "../Models/usuariosModel.js";
import { hashSenha, compararSenha } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//ROTINA DE CADASTRO
export const cadastroController = async(req, res) => {
    try{
        const { nome, email, cpf, dataNascimento, telefone, senha, cep, endereco, numEnd, bairro, complementoEnd, cidade, estado, perfil } = req.body;
        
        //Validações
        //complementar com mais validações!
        if(!nome) return res.send({message: "Nome é obrigatório!"});
        if(!email) return res.send({message: "E-mail é obrigatório!"});
        if(!cpf) return res.send({message: "CPF é obrigatório!"});
        if(!dataNascimento) return res.send({message: "Data de nascimento é obrigatório!"});
        if(!telefone) return res.send({message: "Telefone é obrigatório!"});
        if(!senha) return res.send({message: "Senha é obrigatório!"});
        if(!cep) return res.send({message: "CEP é obrigatório!"});
        if(!endereco) return res.send({message: "Endereço é obrigatório!"});
        if(!numEnd) return res.send({message: "Número é obrigatório!"});
        if(!bairro) return res.send({message: "Bairro é obrigatório!"});
        if(!cidade) return res.send({message: "Cidade é obrigatório!"});
        if(!estado) return res.send({message: "Estado é obrigatório!"});
        
        //Checagem de existência de usuário
        const cpfExistente = await usuariosModel.findOne({cpf});
        const emailExistente = await usuariosModel.findOne({email});
        if(cpfExistente||emailExistente){
            return res.status(200).send({
                success:false,
                message:"Usuário já cadastrado!"
            });
        }

        //Criptografia da senha
        const cryptSenha = await hashSenha(senha);

        //Registro no banco
        const usuarioNovo = await new usuariosModel({nome, email, cpf, dataNascimento, 
            telefone, senha: cryptSenha, cep, endereco, numEnd, bairro, 
            complementoEnd, cidade, estado, perfil}).save();
            
        res.status(201).send({
            success:true,
            message:"Usuário criado com sucesso!",
            usuarioNovo //checar a relevância posteriormente!
        })
    } catch(e){
        console.log(e);
        res.status(500).send({
            success:false,
            message:"Erro no cadastro"
        });
    }
};

//ROTINA DE LOGIN
export const loginController = async (req, res) => {
    try {
        //Validações
        const { email, senha } = req.body;
        if(!email) return res.send({message: "E-mail é obrigatório!"});
        if(!senha) return res.send({message: "Senha é obrigatório!"});

        //Checagem de existência de usuário
        const usuario = await usuariosModel.findOne({email});   
        if(!usuario){
            return res.status(404).send({
                success:false,
                message:"Email não encontrado!"
            });
        }

        //Comparação de senhas
        const matchSenha = await compararSenha(senha, usuario.senha);
        if(!matchSenha){
            return res.status(200).send({
                success:false,
                message:"Senha inválida!"
            });
        }

        //Criação do token
        const token = await JWT.sign({_id:usuario.id}, process.env.SECRET, {expiresIn: "1h"});
        res.status(200).send({
            success:true,
            message:"Login com sucesso!",
            usuario, //checar a relevância posteriormente!
            token
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            success:false,
            message:"Erro no login"
        })
    };
};