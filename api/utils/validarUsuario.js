const {bancoDadosIndice} = require('../database/bancoDados.js')

const validarUsuario = async (usuario, login=false) => {
    try{
        if(!login){
            const usernameExiste = await bancoDadosIndice.get(usuario)
            if (usernameExiste) {
                return { sucesso: false, status:409, mensagem: "usuario já cadastrado." };
            }
        }
        throw new Error();
    }catch(err){

        if(!usuario) {
            return {sucesso:false, status:400, mensagem:"usuário não pode ser nulo"}
        }
        const regexUsuario = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$/;
        if (usuario.length < 3 || usuario.length > 20) {
            return { sucesso: false, status:400, mensagem: "O username deve ter entre 3 e 20 caracteres." };
        }
    
        if (!regexUsuario.test(usuario)) {
            return { 
                sucesso: false, 
                status:400,
                mensagem: "nome de usuário inválido"
            };
        }
    
        return { sucesso: true, status:200, mensagem: "username válido." };
    }
};

module.exports = {
    validarUsuario
}