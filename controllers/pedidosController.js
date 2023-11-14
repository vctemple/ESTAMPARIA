import pedidosModel from "../Models/pedidosModel.js";

export const cadastroPedido = async (req, res) => {
    try {
      const {
        status,
        tipoPgto,
        usuario,
        carrinho,
        total
      } = req.body;

      console.log(total)
  
      //Validações
      //complementar com mais validações!
      if (status === null) return res.send({ message: "Status não definido" });
      if (tipoPgto === null) return res.send({ message: "Tipo de pagamento não definido!" });
      if (!usuario) return res.send({ message: "Usuário não definido!" });
      if (!carrinho) return res.send({ message: "Carrinho não definido!" });
      if (!total) return res.send({ message: "Total não definido!" });

       const pedidoNovo = await new pedidosModel({
        status,
        tipoPgto,
        usuario,
        carrinho,
        total
      }).save();
  
      res.status(201).send({
        success: true,
        message: "Pedido de compras efetuado!",
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
      const pedidosUser = await pedidosModel
        .find({"usuario": req.params.pid})
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        message: "Lista de todos os pedidos",
        pedidosUser
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

  export const listPedidos = async (req, res) => {
    try {
      const pedidos = await pedidosModel
        .find()
        .populate("usuario", "email")
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        message: "Lista de todos os pedidos",
        pedidos
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