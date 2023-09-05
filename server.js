import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import authRouter from "./routes/authRoute.js";
import cors from "cors";
import fornecedoresRouter from "./routes/fornecedoresRoute.js";
import produtosRouter from "./routes/produtosRoute.js";

//Carregamento das variáveis de ambiente
dotenv.config();

//Carregamento do banco de dados
dbConnection();

//Carregamento do framework Express
const app = express();

//Carregamento dos middleware necessários para realizar as requisições HTTP
app.use(cors()); //desta forma o cors autoria qualquer origem de requisição
app.use(express.json());
app.use(morgan("[:date[web]] ':method :url HTTP/:http-version' :status"));

//ROTAS
//Autenticação e Usuários
app.use("/api/v1/auth", authRouter);

//Fornecedores
app.use("/api/v1/fornecedores", fornecedoresRouter);

//Produtos
app.use("/api/v1/produtos", produtosRouter);

//Porta padrão do backend
const GATE = process.env.GATE;

//Execução do listening do servidor
app.listen(GATE, () => {
  console.log(`Backend rodando na porta ${GATE}`);
});
