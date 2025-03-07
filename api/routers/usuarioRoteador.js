const express = require('express');
const roteadores = express.Router();
const {
    obterUsuarioAtual,
    obterUsuarioEspecifico,
    obterTodosUsuarios,
    adicionarUsuario,
    atualizarDadosUsuario,
    removerUsuarioEspecifico
} = require('../controllers/controladorUsuario.js');

roteadores.get('/', obterUsuarioAtual);
roteadores.get('/all', obterTodosUsuarios);
roteadores.get('/:id', obterUsuarioEspecifico);
roteadores.post('/cadastro', adicionarUsuario);
roteadores.post('/:id', atualizarDadosUsuario);
// roteadores.delete('/id', removerUsuarioEspecifico);

module.exports = roteadores;