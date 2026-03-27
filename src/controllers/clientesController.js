const path = require('path');
const db = require('../models/database');
const fs = require('fs'); // Importado aqui no topo para ficar organizado

const clientesController = {
    // 1. LISTAR
    index: (req, res) => {
        const sql = 'SELECT * FROM clientes ORDER BY nome ASC';
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).send("Erro ao acessar banco.");
            res.render('clientes', { clientes: rows });
        });
    },

    // 2. NOVO
    novo: (req, res) => {
        const { nome, cpf, data_nascimento, telefone, historico } = req.body;
        let foto = 'default-avatar.png';
        if (req.files && req.files['foto'] && req.files['foto'][0]) {
            foto = req.files['foto'][0].filename;
        }
        const sql = 'INSERT INTO clientes (nome, cpf, data_nascimento, telefone, foto, historico) VALUES (?,?,?,?,?,?)';
        db.run(sql, [nome, cpf, data_nascimento, telefone, foto, historico], (err) => {
            if (err) return res.status(500).send("Erro ao cadastrar.");
            res.redirect('/clientes');
        });
    },

    // 3. EDITAR
    editar: (req, res) => {
        const id = req.params.id;
        db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, cliente) => {
            if (err || !cliente) return res.redirect('/clientes');
            db.all('SELECT * FROM exames WHERE cliente_id = ?', [id], (err, exames) => {
                res.render('editar-cliente', { 
                    cliente: cliente, 
                    exames: exames || [] 
                });
            });
        });
    },

    // 4. ATUALIZAR
    atualizar: (req, res) => {
        const id = req.params.id;
        const { nome, cpf, data_nascimento, telefone, historico, foto_atual } = req.body;
        let fotoPerfil = foto_atual || 'default-avatar.png'; 
        if (req.files && req.files['foto'] && req.files['foto'][0]) {
            fotoPerfil = req.files['foto'][0].filename;
        }
        const sql = `UPDATE clientes SET nome=?, cpf=?, data_nascimento=?, telefone=?, foto=?, historico=? WHERE id=?`;
        db.run(sql, [nome, cpf, data_nascimento, telefone, fotoPerfil, historico, id], (err) => {
            if (err) return res.status(500).send("Erro ao salvar dados.");
            if (req.files && req.files['exames']) {
                req.files['exames'].forEach(arquivo => {
                    db.run('INSERT INTO exames (cliente_id, arquivo, tipo) VALUES (?, ?, ?)', [id, arquivo.filename, 'Exame/Foto']);
                });
            }
            res.redirect('/clientes');
        });
    },

    // 5. RELATÓRIO
    gerarRelatorio: (req, res) => {
        const id = req.params.id;
        db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, cliente) => {
            if (err || !cliente) return res.redirect('/clientes');
            db.all('SELECT * FROM exames WHERE cliente_id = ?', [id], (err, exames) => {
                res.render('relatorio-cliente', { cliente: cliente, exames: exames || [] });
            });
        });
    },

    // 6. DELETAR CLIENTE
    deletar: (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM clientes WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).send("Erro ao excluir.");
            res.redirect('/clientes');
        });
    },

    // 7. EXCLUIR EXAME INDIVIDUAL (Agora dentro do objeto!)
    excluirExame: (req, res) => {
        const { exameId, clienteId } = req.params;
        db.get('SELECT arquivo FROM exames WHERE id = ?', [exameId], (err, row) => {
            if (err || !row) return res.status(500).send("Erro ao localizar exame.");
            const caminhoArquivo = path.join(__dirname, '../../public/uploads/clientes/', row.arquivo);
            db.run('DELETE FROM exames WHERE id = ?', [exameId], (errDelecao) => {
                if (errDelecao) return res.status(500).send("Erro ao deletar do banco.");
                if (fs.existsSync(caminhoArquivo)) {
                    fs.unlinkSync(caminhoArquivo);
                }
                res.redirect(`/clientes/editar/${clienteId}`);
            });
        });
    }
}; // CHAVE DE FECHAMENTO DO OBJETO AQUI

module.exports = clientesController;