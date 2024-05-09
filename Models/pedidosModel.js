import mongoose from "mongoose";

const schemaPedidos = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "PENDENTE",
    },
    tipoPgto: {
      type: String,
      default: "CARTAO_CRED",
    },
    usuario: {
      type: mongoose.ObjectId,
      ref: "Usuarios",
      require: true,
    },
    carrinho: [
      {
        anuncio: {
          type: mongoose.ObjectId,
          ref: "Anuncios",
        },
        skusItem: [{
          type: String,
        }],
        qtd: Number,
        estampaPersnFrente: String,
        estampaPersnTras: String,
        posicaoEstampaTras: Number,
      },
    ],
    totalCarrinho: {
      type: Number,
      require: true,
    },
    fretePreco: {
      type: Number,
      require: true,
    },
    freteEmpresa: {
      type: String,
      trim: true,
      require: true,
    },
    freteServico: {
      type: String,
      trim: true,
      require: true,
    },
    totalPedido: {
      type: Number,
      require: true,
    },
    entradaPgtoLiq: {
      type: Number,
    },
    urlPagamento: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pedidos", schemaPedidos);
