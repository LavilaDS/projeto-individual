const { bancoDadosLogin } = require('../database/bancoDados.js');

const obterUsuarioAtual = (req, res) => {
    res.status(200).json({sucess:true});
};


const obterUsuarioEspecifico = (req, res) => {
    res.status(200).json({sucess:true});
};

const obterTodosUsuarios = (req, res) => {
    res.status(200).json({sucess:true});
}

const adicionarUsuario = (req, res) => {
    res.status(200).json({sucess:true});
}

const atualizarDadosUsuario = (req, res) => {
    res.status(200).json({sucess:true})
}

const removerUsuarioEspecifico = (req, res) => {
    res.status(200).json({sucess:true})
}


module.exports = {
    obterUsuarioAtual,
    obterUsuarioEspecifico,
    obterTodosUsuarios,
    adicionarUsuario,
    atualizarDadosUsuario,
    removerUsuarioEspecifico
}