const express = require('express');
const app = express();
const config = require('./config')
const PORT = config.PORT|| 80
const cookieParser = require('cookie-parser');
const roteador = require('./routers')

app.use(cookieParser());
app.use(express.json());
app.use('/api', roteador);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});