import financasModel from "../Models/financasModel.js";

//ROTINA DE INSERIR VALOR FINANCEIRO
export const inserirValor = async (req, res) => {
  try {
    let { descricao_movimento, valor_movimento, valNegativo } = req.body;

    //Validações
    //complementar com mais validações!

    if (!descricao_movimento)
      return res.send({ message: "Descrição é obrigatório!" });
    if (!valor_movimento) return res.send({ message: "Valor é obrigatório!" });

    if (valNegativo) valor_movimento = -Math.abs(valor_movimento);
    else valor_movimento = Math.abs(valor_movimento);

    //inserção do sku
    const valor = await financasModel.findByIdAndUpdate(
      "660208a040e5c66d6e49aeaf",
      {
        $push: {
          movimento: {
            descricao_movimento,
            valor_movimento,
          },
        },
        $inc: { saldo: parseFloat(valor_movimento).toFixed(2) },
      }
    );

    //registro no banco
    await valor.save();

    res.status(201).send({
      success: true,
      message: "Valor inserido!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};

export const listarMovimento = async (req, res) => {
  try {
    let { dataInicio, dataFim } = req.body;
    let args = [];
    dataInicio = Date.parse(dataInicio);
    dataFim = Date.parse(dataFim);

    args.push({
      $project: {
        saldo: 1,
        movimento: {
          $filter: {
            input: "$movimento",
            as: "m",
            cond: {
              $and: [
                {
                  $gte: [
                    "$$m.data_movimento",
                    new Date(dataInicio + 1 * 24 * 60 * 60 * 500),
                  ],
                },
                {
                  $lte: [
                    "$$m.data_movimento",
                    new Date(dataFim + 2 * 24 * 60 * 60 * 900),
                  ],
                },
              ],
            },
          },
        },
      },
    });

    const balanco = await financasModel.aggregate(args);
    console.log(balanco);
    res.status(200).send({
      success: true,
      message: "Lista de movimentos",
      balanco,
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
