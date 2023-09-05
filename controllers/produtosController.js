import produtosModel from "../Models/produtosModel.js";
import fs from "fs";

export const cadastroController = async (req, res) => {
  try {
    const {
      nome,
      tecido,
      estampa,
      quantidade,
      tamanho,
      cor,
      preco,
      custo,
      fornecedor,
      marca,
    } = req.fields;
    const { imgFrente, imgTras, imgCorpo } = req.files;

    //Validações
    //complementar com mais validações!
    if (!nome) return res.send({ message: "Nome é obrigatório!" });
    if (!tecido) return res.send({ message: "E-mail é obrigatório!" });
    if (!estampa) return res.send({ message: "CPF é obrigatório!" });
    if (!quantidade) return res.send({ message: "Telefone é obrigatório!" });
    if (!tamanho) return res.send({ message: "CEP é obrigatório!" });
    if (!cor) return res.send({ message: "Endereço é obrigatório!" });
    if (!preco) return res.send({ message: "Número é obrigatório!" });
    if (!custo) return res.send({ message: "Bairro é obrigatório!" });
    if (!fornecedor) return res.send({ message: "Cidade é obrigatório!" });
    if (!marca) return res.send({ message: "Estado é obrigatório!" });
    if (!imgFrente || imgFrente.size > 1000000)
      return res.send({ message: "Imagem obrigatória de até 1mb" });
    if (!imgTras || imgTras.size > 1000000)
      return res.send({ message: "Imagem obrigatória de até 1mb" });
    if (!imgCorpo || imgCorpo.size > 1000000)
      return res.send({ message: "Imagem obrigatória de até 1mb" });

    //Checagem de existência de mesmo produto
    const produtoExistente = await produtosModel.findOne({
      nome,
      tecido,
      estampa,
      tamanho,
      cor,
      marca,
    });
    if (produtoExistente) {
      return res.status(200).send({
        success: false,
        message: "produto já cadastrado!",
      });
    }

    //criação do objeto
    const produtos = new produtosModel({ ...req.fields });

    //captura dos caminhos das imagens
    produtos.imgFrente.data = fs.readFileSync(imgFrente.path);
    produtos.imgFrente.contentType = imgFrente.type;

    produtos.imgTras.data = fs.readFileSync(imgTras.path);
    produtos.imgTras.contentType = imgTras.type;

    produtos.imgCorpo.data = fs.readFileSync(imgCorpo.path);
    produtos.imgCorpo.contentType = imgCorpo.type;

    //registro no banco
    await produtos.save();
    res.status(201).send({
      success: true,
      message: "Produto criado com sucesso!",
      produtos,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};
