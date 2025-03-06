const express = require('express');
const roteadores = express.Router();
const rotaLogin = require('./loginRoteador');

roteadores.use('/login', rotaLogin);
roteadores.use('/evento');


module.exports = {
    roteadores
}