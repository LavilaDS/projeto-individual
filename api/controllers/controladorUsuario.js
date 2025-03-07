const { bancoDadosLogin } = require('../database/bancoDados.js');

const  { validarToken } = require('../utils/validarToken.js')

const obterUsuarioAtual = async (req, res) => {
    try{
        const token = req.cookies.tokenAcesso;
        console.log(token)
        const resultado = await validarToken(token);

        if(resultado.sucesso){
            console.log(resultado.dados)
        } else {
            return res.status(401).json({sucesso:false, mensagem:resultado.mensagem})
        }
        res.status(200).json({sucesso:true, dados:resultado.dados});
    }catch(err){
        res.status(500).json({sucesso:false, mensagem:"erro interno no servidor"})
    }

};


const obterUsuarioEspecifico = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ sucesso: false, mensagem: "id usuario é necessário" });
        }
        const dados = await bancoDadosLogin.get(userId); 
        return res.status(200).json({ sucesso: true, dados });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ sucesso: false, mensagem: "usuário não encontrado" });
        }
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).json({ sucesso: false, mensagem: "erro interno no servidor" });
    }
};

// const obterUsuarioEspecifico = (req, res) => {
//     res.status(200).json({sucess:true});
// };

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