const express = require('express');
const roteadores = express.Router();


roteadores.get('/', obterEventoAtual);
roteadores.get('/:id', obterEventoEspecifico);
roteadores.get('/all', obterTodosEventos);
roteadores.post('/', adicionarEvento);
roteadores.post('/:id', atualizarDadosEvento);
roteadores.delete('/id', removeEventoEspecífico);