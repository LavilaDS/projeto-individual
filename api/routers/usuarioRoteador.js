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

console.log(atualizarDadosUsuario)
roteadores.get('/', obterUsuarioAtual);
roteadores.get('/:id', obterUsuarioEspecifico);
roteadores.get('/all', obterTodosUsuarios);
roteadores.post('/', adicionarUsuario);
roteadores.post('/:id', atualizarDadosUsuario);
roteadores.delete('/id', removerUsuarioEspecifico);

module.exports = roteadores;