const senhaSecreta = process.env.senhaSecreta
const jwt = require('jsonwebtoken');


const gerarToken = (dados, tempoValidade) => {
    const {id,usuario, nome, eventos } = dados
    const carga = {
        id,
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