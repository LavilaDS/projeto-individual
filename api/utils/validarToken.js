const jwt = require('jsonwebtoken');



const validarToken = async (valor) => {
    try {
        console.log(valor);
        if (!valor) {
            throw new Error("token não fornecido");
        }

        const user = await new Promise((resolve, reject) => {
            const senhaSecreta = process.env.senhaSecreta
            jwt.verify(valor, senhaSecreta, (err, user) => {
                if (err) {
                    console.log(err)
                    return reject(new Error("token inválido"));
                }
                resolve(user); // Resolve com os dados do usuário se o token for válido
            });
        });

        return { sucesso: true, dados: user }; // Retorna sucesso e os dados do usuário
    } catch (err) {
        console.log(err)
        return { sucesso: false, mensagem: err.message }; // Captura e retorna a mensagem de erro
    }
};

module.exports = {
    validarToken
}