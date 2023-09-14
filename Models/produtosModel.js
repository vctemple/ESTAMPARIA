import mongoose from "mongoose";

const schemaProdutos = new mongoose.Schema({
    nome:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    tecido:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    },
    estampa:{
        type:String,
        required:true,
        trim:true,
        maxLength:70
    }, 
    quantidade:{
        type:Number,
        require:true
    },
    tamanho:{
        type:String,
        require:true,
        maxLength:2,
        minLength:1
    },
    cor:{
        type:String,
        require:true,
        maxLength:70
    },
    preco:{
        type:Number,
        require:true
    },
    custo:{
        type:Number,
        require:true
    },
    fornecedor:{
        type:mongoose.ObjectId,
        ref:"Fornecedores",
        require:true
    },
    marca:{
        type:String,
        require:true,
        maxLength:70
    },
    imgFrente:String,
    imgTras:String,
    imgCorpo:String

}, {timestamps:true});

export default mongoose.model("Produtos", schemaProdutos)