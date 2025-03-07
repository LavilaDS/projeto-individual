const {bancoDadosIndice} = require('../database/bancoDados.js')

const validarEmail = async (email, login=false) => {
    try{
        if(!email) return {sucesso:false, status:400, mensagem:"email não pode ser nulo"};

        if(!login){
            const emailExiste = await bancoDadosIndice.get(email)
            if (emailExiste) {
                return { sucesso: false, status:409, mensagem: "e-mail já cadastrado." };
            }    
        }
        throw new Error();
    } catch(err){
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return { sucesso: false,status:400, mensagem: "e-mail inválido." };
        }
        return { sucesso: true, status:200, mensagem: "e-mail válido." };
    }
};

module.exports = {
    validarEmail
}