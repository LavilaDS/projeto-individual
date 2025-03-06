const gerarToken = (usuario, tempoValidade) => {
    // Dados do payload, aqui você pode adicionar mais informações conforme necessário
    const payload = {
        id: usuario.id,
        nome: usuario.nome
    };

    // Gerar o token com o tempo de expiração especificado
    const refreshToken = jwt.sign(payload, 'seuSegredoAqui', {
        expiresIn: tempoValidade
    });

    return refreshToken;
}

module.exports = gerarToken;