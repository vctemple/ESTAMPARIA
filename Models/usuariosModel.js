import mongoose from "mongoose";

const schemaUsuarios = new mongoose.Schema({
    nome:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxLength:70
    },
    cpf:{
        type:Number,
        required:true,
        unique:true,
    },
    dataNascimento:{
        type:Date,
        required:true
    },
    telefone:{
        type:String,
        required:true,
        trim:true,
        maxLength:20
    },
    senha:{
        type:String,
        required:true,
        maxLength:255
    },
    cep:{
        type:String,
        required:true,
        maxLength:9
    },
    endereco:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    numEnd:{
        type:String,
        required:true,
        trim:true,
        maxLength:9
    },
    bairro:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    complementoEnd:{
        type:String,
        maxLength:70,
        trim:true
    },
    cidade:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    estado:{
        type:String,
        required:true,
        maxLength:2,
        minLength:2
    },
    perfil:{
        type:Number  
    },
    ativo:{
        type:Boolean,
        default:true
    },
    deletado:{
        type:Boolean,
        default:false
    },
    imagem:String,
}, {timestamps:true});

export default mongoose.model("Usuarios", schemaUsuarios);