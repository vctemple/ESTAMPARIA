import mongoose from "mongoose";

const schemaProdutos = new mongoose.Schema(
  {
    nome_estampa: {
      type: String,
      required: true,
      trim: true,
      maxLength: 70,
    },
    imgEstampa: String,
    descricao: {
      type: String,
      trim: true,
      maxLength: 70,
    },
    dimensoes: [
      {
        type: String,
        required: true,
        trim: true,
        maxLength: 70,
      },
    ],
    ativo_estampa: {
      type: Boolean,
      default: true,
    },
    SKUs: [
      {
        sku: {
          type: String,
          trim: true,
          maxLength: 70,
        },
        dimensao_estampa: {
          type: String,
          trim: true,
          maxLength: 70,
        },
        tipo_estampa: {
          type: String,
          trim: true,
          maxLength: 70,
        },
        tecido_camiseta: {
          type: String,
          trim: true,
          maxLength: 70,
        },
        cor_camiseta: {
          type: String,
          maxLength: 70,
        },
        tamanho_camiseta: {
          type: String,
          maxLength: 2,
          minLength: 1,
        },
        marca_camiseta: {
          type: String,
          maxLength: 70,
        },
        quantidade: {
          type: Number,
        },
        custo_lote: {
          type: Number,
        },
        fornecedor: {
          type: mongoose.ObjectId,
          ref: "Fornecedores",
        },
        imgFrente: String,
        ativo_sku: {
          type: Boolean,
          default: false,
        },
        data_cadastro_sku: {
          type: Date, 
          default: Date.now()
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Produtos", schemaProdutos);
