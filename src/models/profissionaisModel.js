const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o ficheiro físico do banco (na raiz do projeto)
const dbPath = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// 1. ERRO DE NOME: Aqui estava 'clientes', mudei para 'profissionais'
db.run(`CREATE TABLE IF NOT EXISTS profissionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    especialidade TEXT,
    registro TEXT,
    telefone TEXT,
    foto TEXT,
    historico TEXT
)`);

// Objeto que exporta as funções para o Controller
const Profissionais = {
    salvar: (dados, callback) => {
        const sql = `INSERT INTO profissionais (nome, especialidade, registro, telefone, foto, historico) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [dados.nome, dados.especialidade, dados.registro, dados.telefone, dados.foto, dados.historico];
        db.run(sql, params, callback);
    },

    listarTodos: (callback) => {
        const sql = "SELECT * FROM profissionais ORDER BY nome ASC";
        db.all(sql, [], callback);
    }, // <-- Coloquei a vírgula aqui

    // 2. ERRO DE CHAVES: A função deletar tem que estar DENTRO do objeto Profissionais
    deletar: (id, callback) => {
        const sql = "DELETE FROM profissionais WHERE id = ?";
        db.run(sql, [id], callback);
    } 
}; // <-- A chave de fechamento do objeto agora está DEPOIS do deletar

module.exports = Profissionais;