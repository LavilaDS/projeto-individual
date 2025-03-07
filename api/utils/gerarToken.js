const senhaSecreta = process.env.senhaSecreta
const jwt = require('jsonwebtoken');


const gerarToken = (dados, tempoValidade) => {
    const {usuario, nomeUsuario, eventos } = dados
    const carga = {
        usuario,
        nomeUsuario,
        eventos
    };
    const refreshToken = jwt.sign(carga, senhaSecreta, {
        expiresIn: tempoValidade
    });

    return refreshToken;
}

module.exports = gerarToken;