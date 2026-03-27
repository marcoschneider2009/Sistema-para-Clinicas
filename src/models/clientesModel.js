const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o ficheiro físico do banco (na raiz do projeto)
const dbPath = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    data_nascimento TEXT,
    telefone TEXT
)`);

// Objeto que exporta as funções para o Controller
const Cliente = {
    salvar: (dados, callback) => {
        const sql = `INSERT INTO clientes (nome, cpf, data_nascimento, telefone) VALUES (?, ?, ?, ?)`;
        const params = [dados.nome, dados.cpf, dados.data_nascimento, dados.telefone];
        db.run(sql, params, callback);
    },

    listarTodos: (callback) => {
        const sql = "SELECT * FROM clientes ORDER BY nome ASC";
        db.all(sql, [], callback);
    }
};

deletar: (id, callback) => {
        const sql = "DELETE FROM clientes WHERE id = ?";
        db.run(sql, [id], callback);
    }

module.exports = Cliente;