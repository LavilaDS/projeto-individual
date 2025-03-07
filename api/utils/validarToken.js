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

        return { sucesso: true, status:200, dados: user };
    } catch (err) {
        if(err.message === "token não fornecido") return {sucesso:false, status:400, mensagem:err.message}
        return { sucesso: false, status:500, mensagem: "erro interno no servidor" }; 
    }
};

module.exports = {
    validarToken
}