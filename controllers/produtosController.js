import produtosModel from "../Models/produtosModel.js";
import financasModel from "../Models/financasModel.js";
import fs from "fs";

export const cadastroEstampa = async (req, res) => {
  try {
    const { nome_estampa, dimensoes, imgEstampa, descricao } = req.body;

    if (!nome_estampa)
      return res.send({ message: "Nome da estampa não definida" });
    if (!dimensoes) return res.send({ message: "Dimensões não definidas" });
    if (!imgEstampa) return res.send({ message: "Imagem obrigatória" });

    const estampaExistente = await produtosModel.findOne({
      nome_estampa,
      imgEstampa,
    });
    if (estampaExistente) {
      return res.status(200).send({
        success: false,
        message: "Estampa já cadastrada!",
      });
    }

    const estampa = await new produtosModel({
      nome_estampa,
      dimensoes,
      imgEstampa,
      descricao,
    }).save();

    res.status(201).send({
      success: true,
      message: "Estampa criada com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};

//CADASTRO DE PRODUTOS
export const cadastroSKU = async (req, res) => {
  try {
    const {
      sku,
      dimensao_estampa,
      tipo_estampa,
      tecido_camiseta,
      cor_camiseta,
      tamanho_camiseta,
      marca_camiseta,
      quantidade,
      custo_lote,
      fornecedor,
      imgFrente,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!sku) return res.send({ message: "SKU é obrigatório!" });
    if (!dimensao_estampa)
      return res.send({ message: "A dimensão é obrigatório!" });
    if (!tipo_estampa)
      return res.send({ message: "Tipo da estampa é obrigatório!" });
    if (!quantidade) return res.send({ message: "Quantidade é obrigatório!" });
    if (!tamanho_camiseta)
      return res.send({ message: "Tamanho da camiseta é obrigatório!" });
    if (!cor_camiseta)
      return res.send({ message: "Cor da camiseta é obrigatório!" });
    if (!custo_lote)
      return res.send({ message: "Custo do lote é obrigatório!" });
    if (!fornecedor) return res.send({ message: "Fornecedor é obrigatório!" });
    if (!marca_camiseta)
      return res.send({ message: "Marca da camiseta é obrigatório!" });
    if (!imgFrente) return res.send({ message: "Imagem obrigatória" });
    if (!tecido_camiseta)
      return res.send({ message: "Tecido da camiseta é obrigatório" });

    //Checagem de existência de mesmo produto
    const produtoExistente = await produtosModel.findOne({
      sku,
    });
    if (produtoExistente) {
      return res.status(200).send({
        success: false,
        message: "SKU já cadastrado!",
      });
    }

    //inserção do sku
    const produto = await produtosModel.findByIdAndUpdate(req.params.pid, {
      $push: {
        SKUs: {
          sku,
          dimensao_estampa,
          tipo_estampa,
          tecido_camiseta,
          cor_camiseta,
          tamanho_camiseta,
          marca_camiseta,
          quantidade,
          custo_lote,
          fornecedor,
          imgFrente,
        },
      },
    });

    const valor = await financasModel.findByIdAndUpdate(
      "660208a040e5c66d6e49aeaf",
      {
        $push: {
          movimento: {
            descricao_movimento: `sku: ${sku}`,
            valor_movimento: -Math.abs(custo_lote),
          },
        },
        $inc: { saldo: -Math.abs(custo_lote) },
      }
    );

    //registro no banco
    await produto.save();
    await valor.save();
    res.status(201).send({
      success: true,
      message: "SKU cadastrado com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};

//LISTAR ESTAMPAS
export const listaEstampa = async (req, res) => {
  try {
    const produtos = await produtosModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Lista de todas estampas",
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

//LISTAR TODOS OS PRODUTOS
export const listProduto = async (req, res) => {
  try {
    const produtos = await produtosModel
      .find({})
      .populate("SKUs.fornecedor", "nome")
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

//DETALHAR ESTAMPA
export const detalheEstampa = async (req, res) => {
  try {
    const estampa = await produtosModel.findById(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Estampa detalhada",
      estampa,
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

//DETALHAR PRODUTO
export const detalheSKU = async (req, res) => {
  try {
    const args = [{
      $project: {
        nome_estampa:1,
        dimensoes: 1,
        imgEstampa: 1,
        skusFiltrados: {
          $filter: {
            input: "$SKUs",
            as: "s",
            cond: {
              $and: {$in: ["$$s.sku", [req.params.pid]]}
          },
        },
      },
    }}]
    let produtoTodos = await produtosModel.aggregate(args);
    let produto = {}
    produtoTodos.forEach((p) => {
      if(p.skusFiltrados.length > 0){
        produto = {
          _id: p._id,
          nome_estampa: p.nome_estampa,
          imgEstampa: p.imgEstampa,
          dimensoes: p.dimensoes,
          SKUs: p.skusFiltrados[0]
        }
      }
    })

      res.status(200).send({
      success: true,
      message: "Produto detalhado",
      produto,
    });
    console.log(produtoTodos);
    console.log("TESTE");
    console.log(produto)
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
    const produto = await produtosModel
      .findById(req.params.pid)
      .select("imgFrente imgTras imgCorpo");
    if (
      produto.imgFrente.data &&
      produto.imgTras.data &&
      produto.imgCorpo.data
    ) {
      return res.status(200).send({
        success: true,
        message: "fotos dos produtos",
        produto,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao carregar fotos",
      error: e.message,
    });
  }
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
  }
};

//EDITAR ESTAMPA
export const editarEstampa = async (req, res) => {
  try {
    const { nome_estampa, dimensoes, imgEstampa, descricao } = req.body;

    //Validações
    //complementar com mais validações!
    if (!nome_estampa)
      return res.send({ message: "Nome da estampa não definida" });
    if (!dimensoes) return res.send({ message: "Dimenções não definidas" });
    if (!imgEstampa) return res.send({ message: "Imagem obrigatória" });

    //criação do objeto
    const estampa = await produtosModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.body },
      { new: true }
    );

    //registro no banco
    await estampa.save();
    res.status(201).send({
      success: true,
      message: "Estampa editada com sucesso!",
      estampa,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

//EDITAR PRODUTO
export const editarSKU = async (req, res) => {
  try {
    const {
      sku,
      dimensao_estampa,
      tipo_estampa,
      tecido_camiseta,
      cor_camiseta,
      tamanho_camiseta,
      marca_camiseta,
      quantidade,
      custo_lote,
      fornecedor,
      imgFrente,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!sku) return res.send({ message: "SKU é obrigatório!" });
    if (!dimensao_estampa)
      return res.send({ message: "A dimensão é obrigatório!" });
    if (!tipo_estampa)
      return res.send({ message: "Tipo da estampa é obrigatório!" });
    if (!quantidade) return res.send({ message: "Quantidade é obrigatório!" });
    if (!tamanho_camiseta)
      return res.send({ message: "Tamanho da camiseta é obrigatório!" });
    if (!cor_camiseta)
      return res.send({ message: "Cor da camiseta é obrigatório!" });
    if (!custo_lote)
      return res.send({ message: "Custo do lote é obrigatório!" });
    if (!fornecedor) return res.send({ message: "Fornecedor é obrigatório!" });
    if (!marca_camiseta)
      return res.send({ message: "Marca da camiseta é obrigatório!" });
    if (!imgFrente) return res.send({ message: "Imagem obrigatória" });
    if (!tecido_camiseta)
      return res.send({ message: "Tecido da camiseta é obrigatório" });

    //Checagem de existência de mesmo produto
    const produtoExistente = await produtosModel.findOne({
      "SKUs.sku": sku,
    });
    if (produtoExistente && sku !== req.params.pid) {
      return res.status(200).send({
        success: false,
        message: "SKU já cadastrado!",
      });
    }
    //criação do objeto
    const produtos = await produtosModel.findOneAndUpdate(
      { "SKUs.sku": req.params.pid },
      {
        $set: {
          "SKUs.$.sku": sku,
          "SKUs.$.dimensao_estampa": dimensao_estampa,
          "SKUs.$.tipo_estampa": tipo_estampa,
          "SKUs.$.tecido_camiseta": tecido_camiseta,
          "SKUs.$.cor_camiseta": cor_camiseta,
          "SKUs.$.tamanho_camiseta": tamanho_camiseta,
          "SKUs.$.marca_camiseta": marca_camiseta,
          "SKUs.$.quantidade": quantidade,
          "SKUs.$.custo_lote": custo_lote,
          "SKUs.$.fornecedor": fornecedor,
          "SKUs.$.imgFrente": imgFrente,
        },
      }
    );

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

//Ativação estampa
export const ativacaoEstampa = async (req, res) => {
  try {
    const statusEstampa = req.body.ativo ? false : true;
    const estampa = await produtosModel.findByIdAndUpdate(
      req.params.pid,
      { ativo_estampa: statusEstampa },
      { new: true }
    );

    //registro no banco
    await estampa.save();
    res.status(201).send({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro na ativação",
    });
  }
};

export const ativacaoSKU = async (req, res) => {
  try {
    const statusProduto = req.body.ativo_sku ? false : true;
    const produtos = await produtosModel.findOneAndUpdate(
      { "SKUs.sku": req.params.sku },
      { $set: { "SKUs.$.ativo_sku": statusProduto } }
    );

    //registro no banco
    await produtos.save();
    res.status(201).send({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

export const filtraProdutos = async (req, res) => {
  try {
    const { tam, cor, precoMin, precoMax } = req.body;
    let args = {};
    if (tam.length > 0) args.tamanho = tam;
    if (cor.length > 0) args.cor = cor;
    if (precoMin && precoMax) {
      args.preco = { $gte: precoMin, $lte: precoMax };
    } else if (precoMin && !precoMax) {
      args.preco = { $gte: precoMin };
    } else if (precoMax && !precoMin) {
      args.preco = { $lte: precoMax };
    }
    const produtos = await produtosModel.find(args);
    res.status(200).send({
      sucess: true,
      produtos,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: "Erro ao filtrar",
      e,
    });
  }
};

//LISTAR TODOS OS PRODUTOS
export const listProdutoAtivo = async (req, res) => {
  try {
    const produtos = await produtosModel
      .find({ ativo: true })
      .select("-imgTras -imgCorpo")
      .populate("fornecedor", "nome")
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
