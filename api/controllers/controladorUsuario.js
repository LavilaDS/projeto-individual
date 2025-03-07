const { bancoDadosLogin } = require('../database/bancoDados.js');

const  { validarToken } = require('../utils/validarToken.js')

const obterUsuarioAtual = async (req, res) => {
    try{
        const token = req.cookies.tokenAcesso;
        console.log(token)
        console.log("ASDSAD")
        const resultado = await validarToken(token);

        if(resultado.sucesso){
            console.log(resultado.dados)
        } else {
            return res.status(401).json({sucesso:false, mensagem:resultado.mensagem})
        }
        res.status(200).json({sucess:true, dados:resultado.dados});
    }catch(err){
        // console.log(err)
        res.status(500).json({sucesso:false, messagem:"Erro desconhecido"})
    }

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