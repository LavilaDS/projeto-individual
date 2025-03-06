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

    put(objeto) {
        if (this.fechado) throw new Error("Banco de Dados não está aberto");

        return new Promise((resolve, reject) => {
            try {
                const chave = objeto.idEvento;
                const stringJSON = JSON.stringify(objeto)

                this.bancoDados.put(chave, stringJSON, err => {
                    if (err) return reject(err);
                    resolve();
                });
            } catch (error) {
                console.log(error)
                reject(new Error("Não foi possível realizar operação"));
            }
        });
    }

    get(chave) {
        if (this.fechado) throw new Error("Banco de Dados não está aberto");

        return new Promise(async (resolve, reject) => {
            this.bancoDados.get(chave, (err, valor) => {
                if (err) return reject(err);
                resolve(JSON.parse(valor.toString()));
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
                    dados.push(valor.toString());
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
    BancoDados
}