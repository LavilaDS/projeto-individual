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
                resolve(user); 
            });
        });

        return { sucesso: true, dados: user };
    } catch (err) {
        console.log(err)
        return { sucesso: false, mensagem: err.message }; 
    }
};

module.exports = {
    validarToken
}