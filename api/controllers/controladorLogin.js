const { bancoDadosLogin } = require('../database/bancoDados.js');
const gerarToken = require('../utils/gerarToken.js');

const main = async() => {
    await bancoDadosLogin.open()
    // const x = await bancoDadosLogin.getAll(undefined,10)
    // console.log(x)
}

main()

const { enviarCookies } = require('../utils/enviarCookies.js')

const autenticarUsuario = async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            res.cookie('token', '', { expires: new Date(0) });
            return res.status(400).json({ success: false });
        }

        const dados = await bancoDadosLogin.get(usuario);
        // console.log(dados)

        if(dados.senha !== senha) {
            enviarCookies(res, "tokenAtualizacao", "");
            enviarCookies(res, "tokenAcesso", "");
            return res.status(401).json({
                success: false,
                message: "credenciais inválidas" 
            });
        }

        const tokenAtualizacao = gerarToken(dados, "1h");
        const tokenAcesso = gerarToken(dados, '15m');

        enviarCookies(res, "tokenAtualizacao", tokenAtualizacao, 1000*60*60);
        enviarCookies(res, "tokenAcesso", tokenAcesso, 1000*60*15);

        res.status(200).json({ success: true });
    } catch (err) {

        enviarCookies(res, "tokenAtualizacao", "");
        enviarCookies(res, "tokenAcesso", "");

        // console.log(err)
        if (err.status === 404) {
            return res.status(404).json({ sucesso: false, messagem: "usuário não encontrado" });
        }
        res.status(500).json({ sucesso: false, messagem: "erro desconhecido" });
    }
};

module.exports = {
    autenticarUsuario
}

