const enviarCookies = (res, chave, valor, tempo=undefined) => {
    const opcoes = {
        httpOnly: true,  
        secure: false
    }
    if(tempo) {
        opcoes["maxAge"] = tempo;
    } else {
        opcoes["expires"] = 0;
    }
    // console.log(opcoes);
    res.cookie(chave, valor, opcoes);
}


module.exports = {
    enviarCookies
}