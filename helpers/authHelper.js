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

export function somenteNumeros(cpf){
    let numeros = cpf.toString().replace(/\.|-/gm,'');
    if(numeros.length === 11)
     return numeros;
  
    return false
   }

export function testaCPF(strCPF) {
    console.log(strCPF)
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;

  for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}