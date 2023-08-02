import mongoose from "mongoose";

//Rotina de conexão com o banco de dados
const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_STRING_CONNECTION);
        console.log(`Conexão estabelecida pelo MongoDB ao banco ${conn.connection.name}`);
    } catch(e) {
        console.log(`Erro ao se conectar com o MongoDB: ${e}`);
    }
};

export default dbConnection;