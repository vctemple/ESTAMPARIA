import mongoose from "mongoose";

const schemaCamiseta = new mongoose.Schema(
  {
    cor_tecido: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    img_frente: String,
    img_tras: String,
    estampa_personalizada: String,
    usuario: {
        type: mongoose.ObjectId,
        ref: "Usuarios",
        require: true,
      },
  },
  { timestamps: true }
);

export default mongoose.model("Camiseta", schemaCamiseta);
