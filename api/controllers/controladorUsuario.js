const {hash} = require('bcrypt');
const { bancoDadosLogin } = require('../database/bancoDados.js');
const { bancoDadosIndice } = require('../database/bancoDados.js');
const { v4: uuidv4 } = require('uuid');
const {validarUsuario} = require('../utils/validarUsuario.js');
const { validarNomeUsuario } = require('../utils/validarNomeUsuario.js');
const {validarEmail} = require('../utils/validarEmail.js');
const {validarSenha} = require('../utils/validarSenha.js');
const {validarToken} = require('../utils/validarToken.js');

const obterUsuarioAtual = async (req, res) => {
    try{
        const token = req.cookies.tokenAcesso;
        // console.log(token)
        const resultado = await validarToken(token);

        if(resultado.sucesso){
            console.log(resultado.dados)
        } else {
            return res.status(401).json({sucesso:false, mensagem:resultado.mensagem})
        }
        res.status(200).json({sucesso:true, dados:resultado.dados});
    }catch(err){
        console.log(err)
        res.status(500).json({sucesso:false, mensagem:"erro interno no servidor"})
    }

};


const obterUsuarioEspecifico = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ sucesso: false, mensagem: "id usuario é necessário" });
        }
        const dados = JSON.parse(await bancoDadosIndice.get(userId)); 
        return res.status(200).json({ sucesso: true, dados });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ sucesso: false, mensagem: "usuário não encontrado" });
        }
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).json({ sucesso: false, mensagem: "erro interno no servidor" });
    }
};

const obterTodosUsuarios = async (req, res) => {
    try {
        let { chave, quantidade } = req.query;
        quantidade = quantidade | 10
        console.log("A");
        const {ultimaChave, dados } = await bancoDadosLogin.getAll(chave, quantidade);
        console.log("B");
        console.log(dados)
        const usuarios = dados.map(item => JSON.parse(item));
        console.log("C");

        return res.status(200).json({ sucesso: true, usuarios, ultimaChave });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ sucesso: false, mensagem: "erro interno no servidor" });
    } 
};


const adicionarUsuario = async (req, res) => {
    try {
        const {
            usuario,
            nome,
            email,
            senha,
            adm
        } = req.body

        const usuarioValido =  await validarUsuario(usuario);
        if(!usuarioValido.sucesso) return res.status(usuarioValido.status).json(usuarioValido);

        const nomeValido = validarNomeUsuario(nome);
        if(!nomeValido.sucesso) return res.status(nomeValido.status).json(nomeValido);

        const emailValido = await validarEmail(email);
        console.log(emailValido)
        if(!emailValido.sucesso) return res.status(emailValido.status).json(emailValido);

        const senhaValida = validarSenha(senha);
        if(!senhaValida.sucesso) return res.status(senhaValida.status).json(senhaValida);

        console.log("E")

        const senhaHash = await hash(senha, 10)
        const id = uuidv4();
        const dados = {
            "id":id,
            "nome":nome,
            "usuario":usuario,
            "email":email,
            "senha":senhaHash,
            "eventos":[]
        }

        bancoDadosIndice.put(usuario, id)
            .then(async () => {
                await bancoDadosLogin.put(id, JSON.stringify(dados));
                await bancoDadosIndice.put(email, id);
                res.json({sucesso:true, status:200, mensagem:"cadastro aprovado"});
            })
            .catch( async(err) =>{
                await bancoDadosIndice.del(email)
                await bancoDadosIndice.del(usuario)
                await bancoDadosLogin.del(id)
                res.json({sucesso:false, status:500, mensagem:"erro interno no servidor"})
            });

    } catch (err) {
        res.status(500).json({sucesso:false, status:500, mensagem:"erro interno no servidor"})
        console.error("Erro ao cadastrar usuário:", err.message);
    } 
};


const atualizarDadosUsuario = async (req, res) => {
    try {
        const idUsuario = await bancoDadosIndice.get(req.params.id);
        const { nome, usuario, email, senha } = req.body;

        if(!nome && !usuario && !email && !senha) return res.status(400).json({sucesso:false, mensagem:"nenhum dado fornecido"});

        if (!idUsuario) {
            return res.status(400).json({ sucesso: false, mensagem: "id usuario nao pode ser nulo" });
        }

        
        const usuarioExistente = await bancoDadosLogin.get(idUsuario);
        console.log(usuarioExistente);
        if (!usuarioExistente) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado" });
        }
        
        let dadosAtualizados = JSON.parse(usuarioExistente);

        if (nome) {
            const nomeValido = validarNomeUsuario(nome);
            if (!nomeValido.sucesso) return res.status(nomeValido.status).json(nomeValido);
            dadosAtualizados.nome = nome;
        }
        console.log("ENTREEEI");

        const transacoes = await bancoDadosIndice.bancoDados.batch();

        if (usuario && (usuario != dadosAtualizados.usuario)) {
            const nomeValido = validarUsuario(usuario);
            if (!nomeValido.sucesso) return res.status(nomeValido.status).json(nomeValido);

            await transacoes.del(dadosAtualizados.nome);
            await transacoes.put(usuario, idUsuario);
            // dadosAtualizados.nome = nome;
        }

        if (email && (email != dadosAtualizados.email)) {
            console.log("Email novo: %s | Antigo email: %s", email, dadosAtualizados.email)
            const emailValido = await validarEmail(email);
            if (!emailValido.sucesso) return res.status(emailValido.status).json(emailValido);
            await transacoes.del(dadosAtualizados.email);
            await transacoes.put(email, idUsuario);
            // dadosAtualizados.email = email;
        }

        if (senha) {
            const senhaValida = validarSenha(senha);
            if (!senhaValida.sucesso) return res.status(senhaValida.status).json(senhaValida);
            // dadosAtualizados.senha = await hash(senha, 10);
        }

        await transacoes.write(async err => {
            if(err) {
                throw err;
            }
            if(nome) dadosAtualizados.nome = nome;
            if(email) dadosAtualizados.email = email;
            if(senha) dadosAtualizados.senha = await hash(senha, 10);
            await bancoDadosLogin.put(idUsuario, JSON.stringify(dadosAtualizados));
            res.status(200).json({ sucesso: true, mensagem: "Dados atualizados com sucesso" });
        });
        
    } catch (err) {
        if(err.status) return res.status(err.status).json(err)
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno no servidor" });
    }
};

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