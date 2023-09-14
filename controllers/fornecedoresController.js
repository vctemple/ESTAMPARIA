import fornecedoresModel from "../Models/fornecedoresModel.js";

//ROTINA DE CADASTRO DE FORNECEDOR
export const cadastroFornecedor = async(req, res) => {
    try{
        const { nome, email, cnpj, telefone, cep, endereco, numEnd, bairro, complementoEnd, cidade, estado } = req.body;
        
        //Validações
        //complementar com mais validações!
        if(!nome) return res.send({message: "Nome é obrigatório!"});
        if(!email) return res.send({message: "E-mail é obrigatório!"});
        if(!cnpj) return res.send({message: "CPF é obrigatório!"});
        if(!telefone) return res.send({message: "Telefone é obrigatório!"});
        if(!cep) return res.send({message: "CEP é obrigatório!"});
        if(!endereco) return res.send({message: "Endereço é obrigatório!"});
        if(!numEnd) return res.send({message: "Número é obrigatório!"});
        if(!bairro) return res.send({message: "Bairro é obrigatório!"});
        if(!cidade) return res.send({message: "Cidade é obrigatório!"});
        if(!estado) return res.send({message: "Estado é obrigatório!"});
        
        //Checagem de existência de fornecedor
        const cnpjExistente = await fornecedoresModel.findOne({cnpj});
        const emailExistente = await fornecedoresModel.findOne({email});
        if(cnpjExistente||emailExistente){
            return res.status(200).send({
                success:false,
                message:"Fornecedor já cadastrado!"
            });
        }

        //Registro no banco
        const fornecedorNovo = await new fornecedoresModel({nome, email, cnpj,
            telefone, cep, endereco, numEnd, bairro, 
            complementoEnd, cidade, estado}).save();
            
        res.status(201).send({
            success:true,
            message:"Fornecedor criado com sucesso!",
            fornecedorNovo //checar a relevância posteriormente!
        })
    } catch(e){
        console.log(e);
        res.status(500).send({
            success:false,
            message:"Erro no cadastro"
        });
    }
};

export const listFornecedores = async (req, res) => {
    try {
      const fornecedores = await fornecedoresModel
        .find({})
        .select("_id nome")
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        message: "Lista de todos os fornecedores",
        total: fornecedores.length,
        fornecedores,
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