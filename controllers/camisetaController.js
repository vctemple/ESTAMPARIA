import camisetaModel from "../Models/camisetaModel.js";

export const cadastroCamiseta = async (req, res) => {
    try {
      const { cor_tecido, descricao, img_frente, img_tras, estampa_personalizada, usuario } = req.body;
  
      if (!cor_tecido)
        return res.send({ message: "Cor do tecido não definido" });
      if (!descricao) return res.send({ message: "Descrição não definida" });
      if (!usuario) return res.send({ message: "Usuario não definido" });
  
      const camiseta = await new camisetaModel({
        cor_tecido, descricao, img_frente, img_tras, estampa_personalizada, usuario,
      }).save();
  
      res.status(201).send({
        success: true,
        message: "Camiseta criada com sucesso!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro no cadastro",
      });
    }
  };

  export const getCamiseta = async (req, res) => {
    try {
      const camiseta = await camisetaModel.findOne({"cor_tecido": req.params.pid});
      console.log(camiseta)
      res.status(200).send({
        success: true,
        camiseta,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro ao detalhar",
        error: e.message,
      });
    }
  };

  export const listCamisetas = async (req, res) => {
    try {
      const camisetas = await camisetaModel.find();
      console.log(camisetas)
      res.status(200).send({
        success: true,
        camisetas,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro ao detalhar",
        error: e.message,
      });
    }
  };

  export const editarCamiseta = async (req, res) => {
    try {
      const { descricao, img_frente, img_tras,} = req.body;
  
      //Validações
      //complementar com mais validações!
      if (!descricao)
        return res.send({ message: "Descrição não definida!" });
      if (!img_frente) return res.send({ message: "Imagem de frente não definida!" });
      if (!img_tras) return res.send({ message: "Imagem de frente não definida!" });
  
      //criação do objeto
      const camiseta = await camisetaModel.findOneAndUpdate(
        {"cor_tecido": req.params.pid},
        { ...req.body },
        { new: true }
      );
  
      //registro no banco
      await camiseta.save();
      res.status(201).send({
        success: true,
        message: "Camiseta editada com sucesso!",
        camiseta,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro ao editar",
      });
    }
  };