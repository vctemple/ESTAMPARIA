import bannerModel from "../Models/bannerModel.js";

export const cadastroBanner = async (req, res) => {
    try {
      const { img_banner } = req.body;
  
      if (!img_banner) return res.send({ message: "Imagem não definida!" });
  
      const banner = await new bannerModel({
        img_banner,
      }).save();
  
      res.status(201).send({
        success: true,
        message: "Banner criado com sucesso!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro no cadastro",
      });
    }
  };

  export const getBanner = async (req, res) => {
    try {
      const banner = await bannerModel.findOne();
      console.log(banner)
      res.status(200).send({
        success: true,
        banner,
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

  export const editarBanner = async (req, res) => {
    try {
      const { img_banner} = req.body;
  
      if (!img_banner) return res.send({ message: "Imagem não definida!" });
  
      //criação do objeto
      const banner = await bannerModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.body },
        { new: true }
      );
  
      //registro no banco
      await banner.save();
      res.status(201).send({
        success: true,
        message: "Banner editado com sucesso!",
        banner,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        message: "Erro ao editar",
      });
    }
  };