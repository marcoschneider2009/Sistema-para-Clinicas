const db = require('../models/database'); 
const fs = require('fs');
const path = require('path');

// 1. LISTAGEM
const listar = (req, res) => {
    const query = "SELECT * FROM profissionais ORDER BY nome ASC";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Erro ao listar profissionais");
        }
        // Renderiza a tela principal de listagem
        res.render('profissionais', { profissionais: rows }); 
    });
};

// 2. FORMULÁRIO DE NOVO (Caminho corrigido com hífen)
const formularioNovo = (req, res) => {
    res.render('novo-profissional', { profissional: null });
};

// 3. TELA DE EDIÇÃO
const editar = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM profissionais WHERE id = ?", [id], (err, row) => {
        if (err || !row) return res.redirect('/profissionais');
        
        // Renderiza a tela de edição (editar-profissional.ejs)
        db.all("SELECT * FROM profissionais ORDER BY nome ASC", [], (err, rows) => {
            res.render('editar-profissional', { 
                profissional: row, 
                profissionais: rows 
            });
        });
    });
};

// 4. SALVAR NOVO
const novo = (req, res) => {
    const { nome, especialidade, registro, telefone, historico } = req.body;
    let foto = 'default-avatar.png';
    if (req.files && req.files['foto']) {
        foto = req.files['foto'][0].filename;
    }

    const query = `INSERT INTO profissionais (nome, especialidade, registro, telefone, foto, historico) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, especialidade, registro, telefone, foto, historico], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Erro ao cadastrar");
        }
        res.redirect('/profissionais');
    });
};

// 5. ATUALIZAR
const atualizar = (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, registro, telefone, foto_atual } = req.body;
    let foto = foto_atual;
    if (req.files && req.files['foto']) {
        foto = req.files['foto'][0].filename;
    }

    const query = `UPDATE profissionais SET nome = ?, especialidade = ?, registro = ?, telefone = ?, foto = ? WHERE id = ?`;
    db.run(query, [nome, especialidade, registro, telefone, foto, id], (err) => {
        if (err) return res.status(500).send("Erro ao atualizar");
        res.redirect('/profissionais');
    });
};

// 6. DELETAR
const deletar = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM profissionais WHERE id = ?", [id], () => res.redirect('/profissionais'));
};

module.exports = { listar, formularioNovo, editar, novo, atualizar, deletar };