const validarSenha = (senha) => {
    if(!senha) return {sucesso:false, status:400, mensagem:"senha não pode ser nula"};
    console.log("Senha não é nula")
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regexSenha.test(senha)) {
        return { 
            sucesso: false,
            status:400, 
            mensagem: "a senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais."
        };
    }
    return { sucesso: true, status:200 };
};

module.exports = {
    validarSenha
}