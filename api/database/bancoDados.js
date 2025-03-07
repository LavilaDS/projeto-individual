const RocksDB = require('rocksdb');
const Path = require('path');

class BancoDados {
    constructor(bancoDadosNome) {
        this.caminho = Path.join(__dirname, '../../', 'database', bancoDadosNome);
        this.bancoDados = new RocksDB(this.caminho, { createIfMissing: true });
        this.fechado = true;
    }   

    open() {
        if (!this.fechado) return;
        return new Promise((resolve, reject) => {
            this.bancoDados.open(err => {
                if (err) return reject(err);
                this.fechado = false;
                resolve();
            });
        });
    }

    clear(){
        if (this.fechado) throw new Error("Banco de Dados não está aberto");
        return new Promise(async (resolve, reject) => {
            await this.bancoDados.clear((err) => {
                if(err) return reject()
                resolve()
            });

        });
    }

    close() {
        if (this.fechado) return;
        return new Promise((resolve, reject) => {
            this.bancoDados.close(err => {
                if (err) return reject(err);
                this.fechado = true;
                resolve();
            });
        });
    }

    put(chave, dados) {
        console.log(chave, dados)
        if (this.fechado) throw new Error("Banco de Dados não está aberto");

        return new Promise((resolve, reject) => {
            try {
                this.bancoDados.put(chave, dados, err => {
                    if (err) return reject(err);
                    resolve();
                });
            } catch (error) {
                console.log(error)
                reject(new Error("Não foi possível realizar operação"));
            }
        });
    }

    batch(){
        this.bancoDados.batch();
    }

    get(chave) {
        if (this.fechado) throw new Error("Banco de Dados não está aberto");
    
        return new Promise((resolve, reject) => {
            this.bancoDados.get(chave, (err, valor) => {
                if (err) {
                    if (err.message && err.message.includes("NotFound")) {
                        return reject({ status: 404, mensagem: "chave não encontrada" });
                    }
                    return reject(err);
                }
                resolve(valor.toString());
            });
        });
    }
    

    del(chave){
        return new Promise(async (resolve, reject) => {
            try{
                this.bancoDados.del(chave, err => reject())
                resolve("Tudo certo")
            }catch(err){
                reject(err)
            }
        });
    }


    getAll(chaveInicial = null, limite = 10, decrescente=false) {
        return new Promise(async (resolve, reject) => {
            try{
                const iterador = this.bancoDados.iterator({ 
                    keyAsBuffer: true,
                    valueAsBuffer: true,
                    reverse: decrescente ? true : false
                });
    
                if (chaveInicial) {
                    iterador.seek(chaveInicial);
                }
                

                let count = 0;
                let chaveFinal;
                let dados = []
    
                for await (const [chave, valor] of iterador) {
                    count++;
                    chaveFinal = chave.toString(); 
                    dados.push({"chave":chave.toString(), valor:valor.toString()});
                    if (count >= limite) {
                        iterador.end();
                        break;
                    }
                }
    
                resolve({ chaveFinal, dados });
            }catch(err){
                reject(err)
            }
        });
    }
}

module.exports = {
    bancoDadosLogin: new BancoDados('usuarios_db'),
    bancoDadosEventos: new BancoDados('eventos_db'),
    bancoDadosIndice: new BancoDados('indices_db')
}