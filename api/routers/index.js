const express = require('express');
const roteadores = express.Router();
const rotaLogin = require('./loginRoteador.js');
const rotaUsuario = require('./usuarioRoteador.js');

roteadores.use('/login', rotaLogin);
roteadores.use('/usuario', rotaUsuario);
// roteadores.use('/evento');


module.exports = roteadores;