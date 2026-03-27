const Escalas = require('../models/escalasModel');
const db = require('../models/database'); // Para buscar o nome do profissional

exports.listar = (req, res) => {
    Escalas.listarTodas((err, escalas) => {
        // Buscamos os profissionais para preencher o <select> do formulário
        db.all("SELECT id, nome FROM profissionais ORDER BY nome ASC", [], (err, profissionais) => {
            res.render('escalas', { 
                dados: escalas, 
                profissionais: profissionais || [] 
            });
        });
    });
};

exports.salvar = (req, res) => {
    const { profissional_id, dia_semana, horario } = req.body;

    // Buscamos o nome do profissional para salvar na tabela de escalas
    db.get("SELECT nome FROM profissionais WHERE id = ?", [profissional_id], (err, prof) => {
        if (err || !prof) return res.redirect('/escalas');

        const novaEscala = {
            profissional_id,
            profissional_nome: prof.nome,
            dia_semana,
            horario: horario || '08:00 - 11:30 / 13:30 - 17:30'
        };

        Escalas.salvar(novaEscala, (err) => {
            if (err) console.error("Erro ao salvar escala:", err);
            res.redirect('/escalas');
        });
    });
};

exports.deletar = (req, res) => {
    Escalas.deletar(req.params.id, () => {
        res.redirect('/escalas');
    });
};