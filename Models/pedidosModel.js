import mongoose from "mongoose";

const schemaPedidos = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
    },
    tipoPgto: {
      type: Number,
      required: true,
    },
    usuario: {
      type: mongoose.ObjectId,
      ref: "Usuarios",
      require: true,
    },
    carrinho: [
      {
        produto: {
          type: mongoose.ObjectId,
          ref: "Produtos",
        },
        qtd: Number,
      },
    ],
    total: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pedidos", schemaPedidos);
