import mongoose from "mongoose";

const schemaFinancas = new mongoose.Schema(
  {
    saldo: {
      type: Number,
    },
    movimento: [
      {
        descricao_movimento: {
          type: String,
          required: true,
        },
        valor_movimento: {
          type: Number,
          require: true,
        },
        data_movimento: {
          type: Date, 
          default: Date.now()
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Financas", schemaFinancas);
