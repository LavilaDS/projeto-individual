const express = require('express');
const roteadores = express.Router();


roteadores.get('/', obterUsuarioAtual);
roteadores.get('/:id', obterUsuarioEspecifico);
roteadores.get('/all', obterTodosUsuarios);
roteadores.post('/', adicionarUsuario);
roteadores.post('/:id', atualizarDadosUsuario);
roteadores.delete('/id', removeUsuarioEspecífico);

module.exports = {
    roteadores
}