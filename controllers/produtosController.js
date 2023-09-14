import produtosModel from "../Models/produtosModel.js";
import fs from "fs";

//CADASTRO DE PRODUTOS
export const cadastroProduto = async (req, res) => {
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
      imgFrente
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!nome) return res.send({ message: "Nome é obrigatório!" });
    if (!tecido) return res.send({ message: "Tecido é obrigatório!" });
    if (!estampa) return res.send({ message: "Estampa é obrigatório!" });
    if (!quantidade) return res.send({ message: "Quantidade é obrigatório!" });
    if (!tamanho) return res.send({ message: "Tamanho é obrigatório!" });
    if (!cor) return res.send({ message: "Cor é obrigatório!" });
    if (!preco) return res.send({ message: "Preço é obrigatório!" });
    if (!custo) return res.send({ message: "Custo é obrigatório!" });
    if (!fornecedor) return res.send({ message: "Fornecedor é obrigatório!" });
    if (!marca) return res.send({ message: "Marca é obrigatório!" });
    if (!imgFrente || imgFrente.size > 1000000)
      return res.send({ message: "Imagem obrigatória de até 1mb" });
    // if (!imgTras || imgTras.size > 1000000)
    //   return res.send({ message: "Imagem obrigatória de até 1mb" });
    // if (!imgCorpo || imgCorpo.size > 1000000)
    //   return res.send({ message: "Imagem obrigatória de até 1mb" });

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
    const produtos =  await new produtosModel({ 
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
      imgFrente }).save();

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

//LISTAR TODOS OS PRODUTOS
export const listProduto = async (req, res) => {
  try {
    const produtos = await produtosModel
      .find({})
      .select("-imgTras -imgCorpo").
      populate("fornecedor", "nome")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Lista de todos os produtos",
      total: produtos.length,
      produtos,
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

//DETALHAR PRODUTO
export const detalheProduto = async (req, res) => {
  try {
    const produto = await produtosModel
      .findOne({ nome: req.params.nome.replace(/-/g, " ") })
      .select("-imgFrente -imgTras -imgCorpo")
      .populate("fornecedor", "nome");
    res.status(200).send({
      success: true,
      message: "Produto detalhado",
      produto,
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

//FOTOS DO PRODUTO
export const fotosProduto = async (req, res) => {
  try {
    const produto = await produtosModel.findById(req.params.pid).select("imgFrente imgTras imgCorpo");
    if(produto.imgFrente.data && produto.imgTras.data && produto.imgCorpo.data){
      return res.status(200).send({
        success: true,
        message: "fotos dos produtos",
        produto
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao carregar fotos",
      error: e.message,
    });
  };
};

//DELETAR PRODUTO
export const deletarProduto = async (req, res) => {
  try {
    await produtosModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Produto deletado com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao deletar produto",
      error: e.message,
    });
  };
};

//EDITAR PRODUTO
export const editarProduto = async (req, res) => {
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

    //criação do objeto
    const produtos = await produtosModel.findByIdAndUpdate(req.params.pid, {...req.fields}, {new:true});

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
      message: "Produto editado com sucesso!",
      produtos,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};