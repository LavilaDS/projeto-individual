const { bancoDadosLogin } = require('../database/bancoDados.js');
bancoDadosLogin.open();

const autenticarUsuario = (req, res) => {
    res.status(200).json({sucess:true})
}

module.exports = {
    autenticarUsuario
}

