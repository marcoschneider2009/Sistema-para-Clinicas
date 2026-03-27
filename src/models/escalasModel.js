const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados (Ajustado para a raiz do projeto)
const dbPath = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

// Criar a tabela de escalas se não existir
db.run(`CREATE TABLE IF NOT EXISTS escalas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profissional_id INTEGER,
    profissional_nome TEXT,
    dia_semana TEXT,
    horario TEXT DEFAULT '08:00 - 11:30 / 13:30 - 17:30',
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
)`, (err) => {
    if (err) console.error("Erro ao criar tabela escalas:", err.message);
});

const Escalas = {
    // Listar todas as escalas
    listarTodas: (callback) => {
        const sql = "SELECT * FROM escalas ORDER BY id DESC";
        db.all(sql, [], callback);
    },

    // Salvar nova escala
    salvar: (dados, callback) => {
        const sql = `INSERT INTO escalas (profissional_id, profissional_nome, dia_semana, horario) VALUES (?, ?, ?, ?)`;
        const params = [dados.profissional_id, dados.profissional_nome, dados.dia_semana, dados.horario];
        db.run(sql, params, callback);
    },

    // Deletar escala
    deletar: (id, callback) => {
        const sql = "DELETE FROM escalas WHERE id = ?";
        db.run(sql, [id], callback);
    }
};

module.exports = Escalas;