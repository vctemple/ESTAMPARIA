import { json } from "express";
import pedidosModel from "../Models/pedidosModel.js";
import produtosModel from "../Models/produtosModel.js";
import usuariosModel from "../Models/usuariosModel.js";
import financasModel from "../Models/financasModel.js";
import fetch from "node-fetch";
import anunciosModel from "../Models/anunciosModel.js";

export const cadastroPedido = async (req, res) => {
  try {
    const {
      usuario,
      carrinho,
      totalCarrinho,
      fretePreco,
      freteEmpresa,
      freteServico,
      totalPedido,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!usuario) return res.send({ message: "Usuário não definido!" });
    if (!carrinho) return res.send({ message: "Carrinho não definido!" });
    if (!totalCarrinho)
      return res.send({ message: "Total do carrinho não definido!" });
    if (!fretePreco)
      return res.send({ message: "Valor do frete não definido!" });
    if (!freteEmpresa)
      return res.send({ message: "Transportadora não definida!" });
    if (!freteServico)
      return res.send({ message: "Serviço de frete não definido!" });
    if (!totalPedido)
      return res.send({ message: "Total do pedido não definido!" });

    const pedidoNovo = await new pedidosModel({
      usuario,
      carrinho,
      totalCarrinho,
      fretePreco,
      freteEmpresa,
      freteServico,
      totalPedido,
      entradaPgtoLiq: null,
    }).save();
    console.log(pedidoNovo);

    res.status(201).send({
      success: true,
      message: "Pedido de compras efetuado!",
      pedidoNovo,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no pedido",
    });
  }
};

export const listPedidosDeUsuario = async (req, res) => {
  try {
    let datalimite = new Date();
    datalimite.setDate(datalimite.getDate() - 3);
    const pedidosAtualizar = await pedidosModel.updateMany({$and: [{usuario: req.params.pid}, {createdAt: {$lt: datalimite}}, {status: "PENDENTE"}]} , {$set: {status: "CANCELADO"}})
    
    const pedidosUser = await pedidosModel
      .find({ usuario: req.params.pid })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Lista de todos os pedidos",
      pedidosUser,
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

export const listPedidosFinalizados = async (req, res) => {
  try {
    let { dataInicio, dataFim } = req.body;
    dataInicio = Date.parse(dataInicio);
    dataFim = Date.parse(dataFim);
    const pedidos = await pedidosModel
      .find({$and: [{status: "PAGO"}, {createdAt:{$gte: new Date(dataInicio + 1 * 24 * 60 * 60 * 500), $lte: new Date(dataFim + 2 * 24 * 60 * 60 * 900)}}]})
      .populate("carrinho.anuncio")
      .sort({ createdAt: -1 });
    

    console.log(pedidos)

    res.status(200).send({
      success: true,
      message: "Lista de todos os pedidos",
      pedidos,
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

export const detalhePedido = async (req, res) => {
  try {
    const pedido = await pedidosModel
      .findOne({_id: req.params.pid}).populate("carrinho.anuncio")
      .populate("usuario", "email")
    
    console.log(pedido)
      res.status(200).send({
      success: true,
      message: "Pedido detalhado",
      pedido,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro na listagem",
      error: e.message,
    });
  }
}

export const getFrete = async (req, res) => {
  try {
    const { produtos, cepUser } = req.body;
    console.log("teste");
    if (!produtos) return res.send({ message: "Carrinho vazio!" });
    if (!cepUser) return res.send({ message: "CEP não informado!" });
    console.log(produtos, cepUser);
    const url =
      "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOKEN_MELHOR_ENVIO}`,
        "User-Agent": "http://localhost:3001 (victor.temple@aluno.ifsp.edu.br)",
      },
      body: JSON.stringify({
        from: { postal_code: "12460030" },
        to: { postal_code: cepUser },
        products: produtos,
      }),
    };

    let array = await fetch(url, options);
    array = await array.json();

    console.log(array);
    res.status(200).send({
      success: true,
      message: "Lista de todos os pedidos",
      array,
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

export const finalizarPagamento = async (req, res) => {
  try {
    const {
      numeroCartao,
      valMes,
      valAno,
      nomeCartao,
      ccvCartao,
      pedidoID,
      totalPedido,
      idUser,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!numeroCartao)
      return res.send({ message: "Número do cartão não definido!" });
    if (!valMes)
      return res.send({ message: "Validade do cartão não definida!" });
    if (!valAno)
      return res.send({ message: "Validade do cartão não definida!" });
    if (!nomeCartao)
      return res.send({ message: "Nome impresso no cartão não definido!" });
    if (!ccvCartao) return res.send({ message: "CCV não definido!" });
    if (!pedidoID) return res.send({ message: "ID do pedido não definido!" });
    if (!totalPedido)
      return res.send({ message: "Total do pedido não definido!" });
    if (!idUser) return res.send({ message: "ID do usuário não definido!" });

    let dataMomento = new Date().toJSON().slice(0, 10);

    const usuario = await usuariosModel.findById(idUser);
    const url = "https://sandbox.asaas.com/api/v3/payments/";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: `$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNzczNzc6OiRhYWNoX2VjNmZkZDY1LWU0YWYtNGEwYS1iNmE0LTkyMjNjMWY1NjUzOA==`,
      },
      body: JSON.stringify({
        billingType: 'credit_card',
    creditCard: {
      holderName: usuario.nome,
      number: numeroCartao,
      expiryMonth: valMes,
      expiryYear: valAno,
      ccv: ccvCartao
    },
    creditCardHolderInfo: {
      name: usuario.nome,
      email: usuario.email,
      cpfCnpj: `${usuario.cpf}`,
      postalCode: usuario.cep,
      addressNumber: usuario.numEnd,
      addressComplement: usuario.complementoEnd,
      phone: usuario.telefone,
      mobilePhone: usuario.telefone,
    },
    customer: usuario.customer,
    dueDate: dataMomento,
    value: totalPedido,
    description: `Pedido: ${pedidoID}`,
    
  })
    };
    console.log(url)
    console.log(options)

    let pagamento = await fetch(url, options);
    pagamento =  await pagamento.json();
    console.log(pagamento);

    if (pagamento.status === "CONFIRMED") {
      const pedido = await pedidosModel.findByIdAndUpdate(
        pedidoID,
        { entradaPgtoLiq: pagamento.netValue, status: "PAGO", urlPagamento: pagamento.transactionReceiptUrl },
        { new: true }
      );
      await pedido.save();

      for(let i=0; i< pedido.carrinho.length; i++){

        const args = [{
          $project: {
            skusFiltrados: {
              $filter: {
                input: "$SKUs",
                as: "s",
                cond: {
                  $and: {$in: ["$$s.sku", pedido.carrinho[i].skusItem]}
              },
            },
          },
        }}]
        let skus = await produtosModel.aggregate(args);
        let passou = false;
        let j = 0
        while(passou === false){ 
          if(skus[j].skusFiltrados.length > 0){
              console.log(skus[j].skusFiltrados[0].sku)
            const produto = await produtosModel.findOneAndUpdate(
                { "SKUs.sku": skus[j].skusFiltrados[0].sku },
                { $inc: {"SKUs.$.quantidade": -pedido.carrinho[i].qtd}, }
              );
              await produto.save();
              passou = true
            }else{
              j += 1
            }
          
        }


      }

      const valor = await financasModel.findByIdAndUpdate(
        "660208a040e5c66d6e49aeaf",
        {
          $push: {
            movimento: {
              descricao_movimento: `VENDA-PEDIDO: ${pedidoID}`,
              valor_movimento: pagamento.netValue,
            },
          },
          $inc: {saldo: pagamento.netValue},
        }
      );
  
      //registro no banco
      await valor.save();
    } else return res.send({ message: "Pagamento não aprovado!" });

    res.status(201).send({
      success: true,
      message: "Pagamento efetuado!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no pedido",
    });
  }
};

export const listTodosPedidos = async (req, res) => {
  try {
    let { dataInicio, dataFim } = req.body;
    dataInicio = Date.parse(dataInicio);
    dataFim = Date.parse(dataFim);
    const pedidos = await pedidosModel
      .find({createdAt:{$gte: new Date(dataInicio + 1 * 24 * 60 * 60 * 500), $lte: new Date(dataFim + 2 * 24 * 60 * 60 * 900)}})
      .populate("carrinho.anuncio")
      .populate("usuario", "email")
      .sort({ createdAt: -1 });
    
    console.log(dataInicio, dataFim)
    console.log(pedidos)

    res.status(200).send({
      success: true,
      message: "Lista de todos os pedidos",
      pedidos,
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


