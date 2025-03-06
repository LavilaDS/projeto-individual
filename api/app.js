const express = require('express');
const app = express();
const config = require('./config')
const PORT = config.PORT|| 80
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});