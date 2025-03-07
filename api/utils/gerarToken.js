const senhaSecreta = process.env.senhaSecreta
console.log(`Senha secreta: ${senhaSecreta}`)
const jwt = require('jsonwebtoken');


const gerarToken = (dados, tempoValidade) => {
    console.log(dados);
    const {usuario, nomeUsuario, eventos } = dados
    console.log('Propriedades desestruturadas:', { usuario, nomeUsuario, eventos });
    const carga = {
        usuario,
        nomeUsuario,
        eventos
    };
    console.log(carga);
    const refreshToken = jwt.sign(carga, senhaSecreta, {
        expiresIn: tempoValidade
    });

    return refreshToken;
}

module.exports = gerarToken;