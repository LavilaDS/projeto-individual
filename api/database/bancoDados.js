const RocksDB = require('rocksdb');
const Path = require('path');

class BancoDados {
    constructor(bancoDadosNome) {
        this.caminho = Path.join(__dirname, '../../', 'database', bancoDadosNome);
        this.bancoDados = new RocksDB(this.caminho, { createIfMissing: true });
        this.fechado = true;
    }   
}

module.exports = {
    BancoDados
}