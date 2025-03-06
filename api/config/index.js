require('dotenv').config()

const config = {
    PORT: process.env.PORT || 80,
    CHAVE_SECRETA: process.env.CHAVE_SECRETA || "Senha qualquer"
}

module.exports = config