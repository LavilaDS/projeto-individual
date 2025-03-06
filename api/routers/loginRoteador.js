const express = require('express');
const roteadores = express.Router();
const {
    autenticarUsuario
} = require('../controllers/controladorLogin.js')

roteadores.get('/', autenticarUsuario);
// roteadores.get('/:id', obterUsuarioEspecifico);
// roteadores.get('/all', obterTodosUsuarios);
// roteadores.post('/', adicionarUsuario);
// roteadores.post('/:id', atualizarDadosUsuario);
// roteadores.delete('/id', removerUsuarioEspecifico);

module.exports = roteadores;