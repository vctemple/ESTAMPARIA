import anunciosModel from "../Models/anunciosModel.js";
import produtosModel from "../Models/produtosModel.js";

export const cadastroAnuncio = async (req, res) => {
  try {
    const {
      SKUs_anuncio,
      preco_venda,
      promocao_anuncio,
      imgFrente_anuncio,
      imgTras_anuncio,
      imgCorpo_anuncio,
    } = req.body;

    if (!SKUs_anuncio) return res.send({ message: "SKU não adicionado!" });
    if (!preco_venda)
      return res.send({ message: "Preço de venda obrigatório" });
    if (!imgFrente_anuncio)
      return res.send({ message: "Imagem de frente obrigatória" });
    if (!imgTras_anuncio)
      return res.send({ message: "Imagem de trás obrigatória" });
    if (!imgCorpo_anuncio)
      return res.send({ message: "Imagem do corpo obrigatória" });

    SKUs_anuncio.forEach(async (element) => {
      const anuncioSkuExistente = await anunciosModel.findOne({
        element,
      });
      if (anuncioSkuExistente) {
        return res.status(200).send({
          success: false,
          message: "SKU já cadastrado em outro anúncio!",
        });
      }
    });

    const anuncio = await new anunciosModel({
      SKUs_anuncio: SKUs_anuncio,
      preco_venda,
      promocao_anuncio,
      imgFrente_anuncio,
      imgTras_anuncio,
      imgCorpo_anuncio,
    }).save();

    SKUs_anuncio.forEach(async (element) => {
      const produtos = await produtosModel.findOneAndUpdate(
        { "SKUs.sku": element },
        { $set: { "SKUs.$.ativo_sku": true } }
      );
      await produtos.save();
    });

    res.status(201).send({
      success: true,
      message: "Anúncio criado com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro no cadastro",
    });
  }
};

//LISTAR ANUNCIOS HOME
export const listaAnuncioProduto = async (req, res) => {
  try {
    let args = [];
    let condicoes = [];
    let produtos = [];

    const { tam, cor, precoMin, precoMax } = req.body;

    if (tam.length > 0) {
      condicoes.push({ $in: ["$$s.tamanho_camiseta", tam] });
    }
    if (cor.length > 0) {
      condicoes.push({ $in: ["$$s.cor_camiseta", cor] });
    }

    args.push({
      $project: {
        nome_estampa: 1,
        descricao: 1,
        imgEstampa: 1,
        skusFiltrados: {
          $filter: {
            input: "$SKUs",
            as: "s",
            cond: {
              $and: condicoes,
            },
          },
        },
      },
    });

    let estampas = await produtosModel.aggregate(args);

    for (let i = 0; i < estampas.length; i++) {
      if (estampas[i].skusFiltrados.length > 0) {
        let precosAnuncios = [];
        let imgsCorpoAnuncios = [];
        let coresAdicionadas = [];

        for (let j = 0; j < estampas[i].skusFiltrados.length; j++) {
          if (estampas[i].skusFiltrados[j].ativo_sku === true) {
            const anuncio = await anunciosModel.find({$and: [{
              SKUs_anuncio: { $all: [estampas[i].skusFiltrados[j].sku] }}, {ativo_anuncio: true}],
            });
            let precoFinalAnuncio = 0;

            if (anuncio.length > 0) {
              if (anuncio[0].promocao_anuncio)
                precoFinalAnuncio =
                  anuncio[0].preco_venda - anuncio[0].promocao_anuncio;
              else precoFinalAnuncio = anuncio[0].preco_venda;

              if (precoMin && precoMax) {
                if (
                  precoFinalAnuncio >= precoMin &&
                  precoFinalAnuncio <= precoMax
                ) {
                  precosAnuncios.push(precoFinalAnuncio);
                  if (
                    !coresAdicionadas.includes(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    )
                  ) {
                    imgsCorpoAnuncios.push(anuncio[0].imgCorpo_anuncio);
                    coresAdicionadas.push(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    );
                  }
                }
              } else if (precoMin && !precoMax) {
                if (precoFinalAnuncio >= precoMin) {
                  precosAnuncios.push(precoFinalAnuncio);
                  if (
                    !coresAdicionadas.includes(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    )
                  ) {
                    imgsCorpoAnuncios.push(anuncio[0].imgCorpo_anuncio);
                    coresAdicionadas.push(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    );
                  }
                }
              } else if (precoMax && !precoMin) {
                if (precoFinalAnuncio <= precoMax) {
                  precosAnuncios.push(precoFinalAnuncio);
                  if (
                    !coresAdicionadas.includes(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    )
                  ) {
                    imgsCorpoAnuncios.push(anuncio[0].imgCorpo_anuncio);
                    coresAdicionadas.push(
                      estampas[i].skusFiltrados[j].cor_camiseta
                    );
                  }
                }
              } else {
                precosAnuncios.push(precoFinalAnuncio);
                if (
                  !coresAdicionadas.includes(
                    estampas[i].skusFiltrados[j].cor_camiseta
                  )
                ) {
                  imgsCorpoAnuncios.push(anuncio[0].imgCorpo_anuncio);
                  coresAdicionadas.push(
                    estampas[i].skusFiltrados[j].cor_camiseta
                  );
                }
              }
            }
          }
        }
        if (precosAnuncios.length > 0) {
          precosAnuncios.sort();
          const preco1 = precosAnuncios[0];
          const preco2 = precosAnuncios[precosAnuncios.length - 1];
          precosAnuncios = [preco1, preco2];

          let imgsNewArr = [estampas[i].imgEstampa];
          let imgsSorted = imgsCorpoAnuncios.sort(
            (a, b) => 0.5 - Math.random()
          );
          const finalImgArr = imgsNewArr.concat(imgsSorted);

          const produto = {
            _id: estampas[i]._id,
            nome: estampas[i].nome_estampa,
            descricao: estampas[i].descricao,
            rangePrecos: precosAnuncios,
            imagens: finalImgArr,
          };
          produtos.push(produto);
        }
      }
    }

    res.status(200).send({
      success: true,
      message: "Lista de todos os anuncios",
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

//LISTAR ANUNCIOS COM ID
export const listaAnuncioProdutoComId = async (req, res) => {
  try {
    let args = [];
    let condicoes = [];
    let produtos = [];
    let anunciosVisitados = [];
    condicoes.push({ $and: ["$$s.ativo_sku", true] });
    const pid = req.params.pid;
    const { tam, cor, precoMin, precoMax } = req.body;

    if (tam.length > 0 && tam !== "0") {
      condicoes.push({ $in: ["$$s.tamanho_camiseta", tam] });
    }
    if (cor.length > 0 && tam !== "0") {
      condicoes.push({ $in: ["$$s.cor_camiseta", cor] });
    }

    args.push({
      $project: {
        _id: 1,
        nome_estampa: 1,
        skusFiltrados: {
          $filter: {
            input: "$SKUs",
            as: "s",
            cond: {
              $and: condicoes,
            },
          },
        },
      },
    });

    let estampas = await produtosModel.aggregate(args);

    for (let i = 0; i < estampas.length; i++) {
      const thisPid = estampas[i]._id.toString();
      if (thisPid === pid) {
        for (let j = 0; j < estampas[i].skusFiltrados.length; j++) {
          const anuncioFind = await anunciosModel.findOne({ $and: [{
            SKUs_anuncio: { $all: [estampas[i].skusFiltrados[j].sku] }}, {ativo_anuncio: true}]
          });

          if(anuncioFind){
            let precoFinalAnuncio;
          if (anuncioFind.promocao_anuncio)
            precoFinalAnuncio =
              anuncioFind.preco_venda - anuncioFind.promocao_anuncio;
          else precoFinalAnuncio = anuncioFind.preco_venda;

          if (precoMin && precoMax) {
            if (
              precoFinalAnuncio >= precoMin &&
              precoFinalAnuncio <= precoMax
            ) {
              if (!anunciosVisitados.includes(anuncioFind._id.str)) {
                const anuncio = {
                  anuncioId: anuncioFind._id.toString(),
                  precoVenda: anuncioFind.preco_venda,
                  promocao: anuncioFind.promocao_anuncio,
                  imagemCorpo: anuncioFind.imgCorpo_anuncio,
                  imagemFrente: anuncioFind.imgFrente_anuncio,
                  imagemTras: anuncioFind.imgTras_anuncio,
                  dimensao_estampa:
                    estampas[i].skusFiltrados[j].dimensao_estampa,
                  tamanho: estampas[i].skusFiltrados[j].tamanho_camiseta,
                  cor: estampas[i].skusFiltrados[j].cor_camiseta,
                  tecido: estampas[i].skusFiltrados[j].tecido_camiseta,
                  tipoEstampa: estampas[i].skusFiltrados[j].tipo_estampa,
                  marcaCamiseta: estampas[i].skusFiltrados[j].marca_camiseta,
                  nomeEstampa: estampas[i].nome_estampa,
                  skuAnuncio: anuncioFind.SKUs_anuncio,
                  skuQtd: estampas[i].skusFiltrados[j].quantidade,
                };
                produtos.push(anuncio);
                anunciosVisitados.push(anuncioFind._id.toString());
              }
            }
          } else if (precoMin && !precoMax) {
            if (precoFinalAnuncio >= precoMin) {
              if (!anunciosVisitados.includes(anuncioFind._id.str)) {
                const anuncio = {
                  anuncioId: anuncioFind._id.toString(),
                  precoVenda: anuncioFind.preco_venda,
                  promocao: anuncioFind.promocao_anuncio,
                  imagemCorpo: anuncioFind.imgCorpo_anuncio,
                  imagemFrente: anuncioFind.imgFrente_anuncio,
                  imagemTras: anuncioFind.imgTras_anuncio,
                  dimensao_estampa:
                    estampas[i].skusFiltrados[j].dimensao_estampa,
                  tamanho: estampas[i].skusFiltrados[j].tamanho_camiseta,
                  cor: estampas[i].skusFiltrados[j].cor_camiseta,
                  tecido: estampas[i].skusFiltrados[j].tecido_camiseta,
                  tipoEstampa: estampas[i].skusFiltrados[j].tipo_estampa,
                  marcaCamiseta: estampas[i].skusFiltrados[j].marca_camiseta,
                  nomeEstampa: estampas[i].nome_estampa,
                  skuAnuncio: anuncioFind.SKUs_anuncio,
                  skuQtd: estampas[i].skusFiltrados[j].quantidade,
                };
                produtos.push(anuncio);
                anunciosVisitados.push(anuncioFind._id.toString());
              }
            }
          } else if (precoMax && !precoMin) {
            if (precoFinalAnuncio <= precoMax) {
              if (!anunciosVisitados.includes(anuncioFind._id.str)) {
                const anuncio = {
                  anuncioId: anuncioFind._id.toString(),
                  precoVenda: anuncioFind.preco_venda,
                  promocao: anuncioFind.promocao_anuncio,
                  imagemCorpo: anuncioFind.imgCorpo_anuncio,
                  imagemFrente: anuncioFind.imgFrente_anuncio,
                  imagemTras: anuncioFind.imgTras_anuncio,
                  dimensao_estampa:
                    estampas[i].skusFiltrados[j].dimensao_estampa,
                  tamanho: estampas[i].skusFiltrados[j].tamanho_camiseta,
                  cor: estampas[i].skusFiltrados[j].cor_camiseta,
                  tecido: estampas[i].skusFiltrados[j].tecido_camiseta,
                  tipoEstampa: estampas[i].skusFiltrados[j].tipo_estampa,
                  marcaCamiseta: estampas[i].skusFiltrados[j].marca_camiseta,
                  nomeEstampa: estampas[i].nome_estampa,
                  skuAnuncio: anuncioFind.SKUs_anuncio,
                  skuQtd: estampas[i].skusFiltrados[j].quantidade,
                };
                produtos.push(anuncio);
                anunciosVisitados.push(anuncioFind._id.toString());
              }
            }
          } else {
            if (!anunciosVisitados.includes(anuncioFind._id.str)) {
              const anuncio = {
                anuncioId: anuncioFind._id.toString(),
                precoVenda: anuncioFind.preco_venda,
                promocao: anuncioFind.promocao_anuncio,
                imagemCorpo: anuncioFind.imgCorpo_anuncio,
                imagemFrente: anuncioFind.imgFrente_anuncio,
                imagemTras: anuncioFind.imgTras_anuncio,
                dimensao_estampa: estampas[i].skusFiltrados[j].dimensao_estampa,
                tamanho: estampas[i].skusFiltrados[j].tamanho_camiseta,
                cor: estampas[i].skusFiltrados[j].cor_camiseta,
                tecido: estampas[i].skusFiltrados[j].tecido_camiseta,
                tipoEstampa: estampas[i].skusFiltrados[j].tipo_estampa,
                marcaCamiseta: estampas[i].skusFiltrados[j].marca_camiseta,
                nomeEstampa: estampas[i].nome_estampa,
                skuAnuncio: anuncioFind.SKUs_anuncio,
                skuQtd: estampas[i].skusFiltrados[j].quantidade,
              };
              produtos.push(anuncio);
              anunciosVisitados.push(anuncioFind._id.toString());
            }
          }
          }
          
        }
      }
    }
    console.log(produtos);
    res.status(200).send({
      success: true,
      message: "Lista de todos os anuncios",
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

//LISTAR TODOS OS ANUNCIOS
export const listAnuncios = async (req, res) => {
  try {
    const anuncios = await anunciosModel
      .find({})
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Lista de todos os anuncios",
      anuncios,
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

//DETALHAR ANUNCIO
export const detalheAnuncio = async (req, res) => {
  try {
    const anuncio = await anunciosModel.findById(req.params.pid);
    const args = [{
      $project: {
        skusFiltrados: {
          $filter: {
            input: "$SKUs",
            as: "s",
            cond: {
              $in: ["$$s.sku", anuncio.SKUs_anuncio]
          },
        },
      },
    }}]
    let produtoCorreto = {};
    let produto = await produtosModel.aggregate(args);
    console.log(produto)
    produto.forEach((p) => {
      console.log(p)
      if (p.skusFiltrados.length > 0) produtoCorreto = p.skusFiltrados[0]
    })
    console.log(produtoCorreto)
    
    res.status(200).send({
      success: true,
      message: "Estampa detalhada",
      anuncio,
      produtoCorreto,
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

//EDITAR ANUNCIO
export const editarAnuncio = async (req, res) => {
  try {
    const {
      preco_venda,
      promocao_anuncio,
      imgFrente_anuncio,
      imgTras_anuncio,
      imgCorpo_anuncio,
    } = req.body;

    //Validações
    //complementar com mais validações!
    if (!preco_venda) return res.send({ message: "Preço é obrigatório!" });
    if (!imgFrente_anuncio) return res.send({ message: "Imagem Frente é obrigatório!" });
    if (!imgTras_anuncio) return res.send({ message: "Imagem Trás é obrigatório!" });
    if (!imgCorpo_anuncio) return res.send({ message: "CImagem Corpo é obrigatório!" });

    //criação do objeto
    const anuncio = await anunciosModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.body },
      { new: true }
    );

    //registro no banco
    await anuncio.save();
    res.status(201).send({
      success: true,
      message: "Anuncio editado!",
      anuncio,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Erro ao editar",
    });
  }
};

export const ativacaoAnuncio = async (req, res) => {
  try {
    const statusAnuncio = req.body.ativo ? false : true;
    const anuncio = await anunciosModel.findByIdAndUpdate(
      req.params.pid,
      { ativo_anuncio: statusAnuncio },
      { new: true }
    );

    //registro no banco
    await anuncio.save();
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
