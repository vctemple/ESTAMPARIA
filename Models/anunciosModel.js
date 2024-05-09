import mongoose from "mongoose";

const schemaAnuncios = new mongoose.Schema(
  {
    SKUs_anuncio: [
      {
        type: String,
        required: true,
      },
    ],
    preco_venda: {
      type: Number,
      required: true,
    },
    promocao_anuncio: {
      type: Number,
      require: true,
    },
    imgFrente_anuncio: String,
    imgTras_anuncio: String,
    imgCorpo_anuncio: String,
    ativo_anuncio: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Anuncios", schemaAnuncios);
