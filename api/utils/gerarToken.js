const senhaSecreta = process.env.senhaSecreta
const jwt = require('jsonwebtoken');


const gerarToken = (dados, tempoValidade) => {
    const {usuario, nome, eventos } = dados
    const carga = {
        usuario,
        nome,
        eventos
    };
    const refreshToken = jwt.sign(carga, senhaSecreta, {
        expiresIn: tempoValidade
    });

    return refreshToken;
}

module.exports = gerarToken;