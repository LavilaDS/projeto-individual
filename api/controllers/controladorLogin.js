const { bancoDadosLogin } = require('../database/bancoDados.js');
const gerarToken = require('../utils/gerarToken.js');
const { v4: uuidv4 } = require('uuid');


const main = async() => {
    await bancoDadosLogin.open()
}

main()

const { enviarCookies } = require('../utils/enviarCookies.js')

const autenticarUsuario = async (req, res) => {
    try {
        const {usuario, email, senha } = req.body;

        const chaveSecundaria = usuario || email

        if (!chaveSecundaria || !senha) {
            res.cookie('token', '', { expires: new Date(0) });
            return res.status(400).json({ success: false, mensagem:"email e senha são obrigatórios" });
        }

        const chavePrimaria = await bancoDadosLogin.get(chaveSecundaria);
        const dados = JSON.parse(await bancoDadosLogin.get(chavePrimaria));

        if(dados.senha !== senha) {
            enviarCookies(res, "tokenAtualizacao", "");
            enviarCookies(res, "tokenAcesso", "");
            return res.status(401).json({
                sucesso: false,
                mensagem: "credenciais inválidas" 
            });
        }

        const tokenAtualizacao = gerarToken(dados, "1h");
        const tokenAcesso = gerarToken(dados, '15m');

        enviarCookies(res, "tokenAtualizacao", tokenAtualizacao, 1000*60*60);
        enviarCookies(res, "tokenAcesso", tokenAcesso, 1000*60*15);

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err)
        enviarCookies(res, "tokenAtualizacao", "");
        enviarCookies(res, "tokenAcesso", "");

        // console.log(err)
        if (err.status === 404) {
            return res.status(404).json({ sucesso: false, mensagem: "usuário não encontrado" });
        }
        res.status(500).json({ sucesso: false, messagem: "erro interno no servidor" });
    }
};

module.exports = {
    autenticarUsuario
}

