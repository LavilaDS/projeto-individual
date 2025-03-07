const validarNomeUsuario = (nome) => {
    if(!nome) return {sucesso:false, status:400, mensagem:"nome não pode ser nulo"};

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    if (nome.length < 2 || nome.length > 50) {
        return { sucesso: false, status:400, mensagem: "O nome deve ter entre 2 e 50 caracteres." };
    }

    if (!regexNome.test(nome)) {
        return { 
            sucesso: false, 
            status:400,
            mensagem: "O nome deve conter apenas letras e espaços, sem espaços duplos ou caracteres especiais."
        };
    }

    return { sucesso: true, status:200};
};

module.exports = {
    validarNomeUsuario
}