const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados (Saindo de src/ para a raiz)
const dbPath = path.resolve(__dirname, '../aura_clinic.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir banco:', err.message);
    } else {
        console.log('Banco SQLite Pronto.');

        // 1. Tabela de Clientes (Base Histórica)
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cpf TEXT,
            data_nascimento TEXT,
            telefone TEXT,
            foto TEXT DEFAULT 'default-avatar.png',
            historico TEXT
        )`);

        // 2. Tabela de Agendamentos
        db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_nome TEXT,
            data TEXT,
            hora TEXT,
            profissional_id INTEGER, 
            procedimento TEXT,
            status TEXT DEFAULT 'Agendado' 
        )`);

        // 3. Tabela de Profissionais
        db.run(`CREATE TABLE IF NOT EXISTS profissionais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            especialidade TEXT,
            registro TEXT,
            telefone TEXT,
            foto TEXT DEFAULT 'default-avatar.png',
            historico TEXT
        )`);

        // 4. Tabela de Exames
        db.run(`CREATE TABLE IF NOT EXISTS exames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            arquivo TEXT,
            tipo TEXT,
            data_upload DATETIME DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
        )`);

        // --- TABELA DE FATURAMENTO AJUSTADA PARA AUTOMAÇÃO ---
        // Removido o erro de fechamento e garantido os valores DEFAULT
        db.run(`CREATE TABLE IF NOT EXISTS faturamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            cliente_nome TEXT NOT NULL,
            procedimento TEXT,
            data_realizada DATE NOT NULL,
            valor_total DECIMAL(10,2) DEFAULT 0.00, 
            forma_pagamento TEXT DEFAULT 'A definir',
            status TEXT DEFAULT 'Pendente',
            agendamento_id INTEGER,
            FOREIGN KEY (cliente_id) REFERENCES clientes (id)
        )`, (err) => {
            if (err) console.error("Erro ao criar tabela faturamento:", err.message);
            else console.log("Tabela 'faturamento' pronta para automação!");
        });

        // --- TABELA DE PARCELAS ---
        db.run(`CREATE TABLE IF NOT EXISTS parcelas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            faturamento_id INTEGER NOT NULL,
            numero_parcela INTEGER NOT NULL,
            total_parcelas INTEGER NOT NULL,
            valor_parcela DECIMAL(10,2) NOT NULL,
            data_vencimento DATE NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (faturamento_id) REFERENCES faturamento(id)
        )`, (err) => {
            if (err) console.error("Erro ao criar tabela parcelas:", err.message);
            else console.log("Tabela 'parcelas' verificada/pronta!");
        });
    }
});

module.exports = db;