import bcrypt from "bcrypt";

//Rotina de criptografia de senha
//Retorna a senha criptografada
export const hashSenha = async(senha) => {
    try{
        const saltRounds = 10;
        const hashed = await bcrypt.hash(senha, saltRounds);
        return hashed;
    } catch(e) {
        console.log(e);
    }
};

//Rotina de comparação de senha
//Retorna booleano
export const compararSenha = async(senha, hashed) => {
    return bcrypt.compare(senha, hashed);
}