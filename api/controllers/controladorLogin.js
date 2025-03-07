const { bancoDadosLogin, bancoDadosIndice } = require('../database/bancoDados.js');
const gerarToken = require('../utils/gerarToken.js');
const {compare} = require('bcrypt');
const {validarEmail} = require('../utils/validarEmail.js');
const {validarUsuario} = require('../utils/validarUsuario.js');

const main = async() => {
    await bancoDadosLogin.open()
    await bancoDadosIndice.open()
    // await bancoDadosIndice.clear()
    // await bancoDadosLogin.clear();
    const dados = await bancoDadosIndice.getAll(undefined);
    console.log(dados)
}

main()

const { enviarCookies } = require('../utils/enviarCookies.js')

const autenticarUsuario = async (req, res) => {
    try {
        const {usuario, email, senha } = req.body;

        const chaveSecundaria = usuario || email

        if (!senha) {
            enviarCookies(res, "tokenAtualizacao");
            enviarCookies(res, "tokenAcesso");
            return res.status(400).json({ success: false, mensagem:"senha nao foi fornecida" });
        }

        if(!usuario && !email){
            enviarCookies(res, "tokenAtualizacao");
            enviarCookies(res, "tokenAcesso");
            return res.status(400).json({ success: false, mensagem:"usuário ou o email foram não fornecidos" });
        }

        if(email){
            const emailValido = await validarEmail(email, true);
            if(!emailValido.sucesso) {
                enviarCookies(res, "tokenAtualizacao");
                enviarCookies(res, "tokenAcesso");
                return res.status(emailValido.status).json(emailValido);
            } 
        } else if(usuario){
            const usuarioValido = await validarUsuario(usuario, true);
            if(!usuarioValido.sucesso){
                enviarCookies(res, "tokenAtualizacao");
                enviarCookies(res, "tokenAcesso");
                return res.status(usuarioValido.status).json(usuarioValido);

            }
        }

        console.log("4")



        const chavePrimaria = await bancoDadosIndice.get(chaveSecundaria);
        const dados = JSON.parse(await bancoDadosLogin.get(chavePrimaria));
        console.log("Tudo certo");
        if(! await compare(senha, dados.senha)) {
            enviarCookies(res, "tokenAtualizacao", "");
            enviarCookies(res, "tokenAcesso", "");
            return res.status(401).json({
                sucesso: false,
                mensagem: "credenciais inválidas" 
            });
        }
        console.log("DADOS")
        console.log(dados);
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
            return res.status(404).json({ sucesso: false, mensagem: "credenciais inválidas" });
        }
        res.status(500).json({ sucesso: false, messagem: "erro interno no servidor" });
    }
};

module.exports = {
    autenticarUsuario
}

