const db = require('../models/database');

const agendamentosController = {
    // --- DASHBOARD (Página Principal do Sistema) ---
    dashboard: (req, res) => {
        // Data para busca interna (Banco de Dados)
        const dataBusca = "2026-03-27"; 
        // Data para exibição no topo (Padrão BR)
        const dataExibicao = "27/03/2026";

        db.get('SELECT COUNT(*) as total FROM clientes', [], (err, rowClientes) => {
            const totalClientes = rowClientes ? rowClientes.total : 0;

            const queryAgendamentos = `
                SELECT a.*, c.foto as foto_cliente 
                FROM agendamentos a
                LEFT JOIN clientes c ON a.paciente_nome = c.nome
                WHERE a.data = ?
                ORDER BY a.hora ASC
            `;

            db.all(queryAgendamentos, [dataBusca], (err, rowsAgendamentos) => {
                db.get('SELECT COUNT(*) as total FROM profissionais', [], (err, rowProf) => {
                    const totalProfissionais = rowProf ? rowProf.total : 0;

                    const stats = {
                        totalClientes: totalClientes,
                        agendadosHoje: rowsAgendamentos ? rowsAgendamentos.length : 0,
                        totalProfissionais: totalProfissionais
                    };

                    res.render('dashboard', {
                        stats: stats,
                        agendamentos: rowsAgendamentos || [],
                        dataHoje: dataExibicao,
                        user: { nome: 'Marco' }
                    });
                });
            });
        });
    },

    // --- LISTAR AGENDAMENTOS (A tela que você usa para gerenciar) ---
    listar: (req, res) => {
        // strftime formata a data YYYY-MM-DD para DD/MM/YYYY diretamente no SQL
        const sql = `
            SELECT id, paciente_nome, 
            strftime('%d/%m/%Y', data) as data_br, 
            hora, profissional, procedimento, status 
            FROM agendamentos 
            ORDER BY data DESC, hora ASC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao listar agendamentos.");
            }
            // Renderiza direto para a raiz de views (agendamentos.ejs)
            res.render('agendamentos', { agendamentos: rows });
        });
    },

    // --- SALVAR NOVO AGENDAMENTO ---
    novo: (req, res) => {
        const { paciente_nome, data, hora, profissional, procedimento, status } = req.body;
        const sql = `INSERT INTO agendamentos (paciente_nome, data, hora, profissional, procedimento, status) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.run(sql, [paciente_nome, data, hora, profissional, procedimento, status], (err) => {
            if (err) return res.status(500).send("Erro ao cadastrar.");
            res.redirect('/agendamentos');
        });
    },

    // --- DELETAR ---
    deletar: (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM agendamentos WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).send("Erro ao excluir.");
            res.redirect('/agendamentos');
        });
    }
};

module.exports = agendamentosController;