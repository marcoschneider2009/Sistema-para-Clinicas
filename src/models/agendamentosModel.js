const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o ficheiro físico do banco (na raiz do projeto)
const dbPath = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// 1. Criar tabela se não existir (sem vírgula no último campo)
db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    data TEXT,
    hora TEXT,
    profissional TEXT,
    procedimento TEXT,
    status TEXT
)`);

// 2. Objeto Agendamentos - Note que as funções estão TODAS dentro das chaves { }
const Agendamentos = {
    salvar: (dados, callback) => {
        const sql = `INSERT INTO agendamentos (nome, data, hora, profissional, procedimento, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [dados.nome, dados.data, dados.hora, dados.profissional, dados.procedimento, dados.status];
        db.run(sql, params, callback);
    }, // <-- Vírgula para separar as funções

    listarTodos: (callback) => {
        const sql = "SELECT * FROM agendamentos ORDER BY nome ASC";
        db.all(sql, [], callback);
    }, // <-- Vírgula aqui também!

    deletar: (id, callback) => {
        const sql = "DELETE FROM agendamentos WHERE id = ?";
        db.run(sql, [id], callback);
    } 
}; // <-- SÓ AQUI fecha o objeto principal

// 3. Exportamos o objeto que criamos lá em cima
module.exports = Agendamentos;