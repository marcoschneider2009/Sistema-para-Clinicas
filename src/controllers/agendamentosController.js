const db = require('../models/database');
const Faturamento = require('../models/faturamentoModel');

const agendamentosController = {
    // 1. DASHBOARD
    dashboard: (req, res) => {
        const dataBusca = "2026-03-27"; 
        const dataExibicao = "27/03/2026";

        db.all('SELECT * FROM profissionais ORDER BY nome ASC', [], (err, profissionais) => {
            if (err) return res.status(500).send("Erro ao buscar profissionais.");

            const queryAgendamentos = `
                SELECT a.*, c.foto as foto_cliente 
                FROM agendamentos a
                LEFT JOIN clientes c ON a.paciente_nome = c.nome
                WHERE a.data = ?
                ORDER BY a.hora ASC
            `;

            db.all(queryAgendamentos, [dataBusca], (err, rowsAgendamentos) => {
                db.get('SELECT COUNT(*) as total FROM clientes', [], (err, rowClientes) => {
                    const agora = new Date();
                    const tempoAtual = (agora.getHours() * 60) + agora.getMinutes();
                    const divisorTurno = (12 * 60);

                    const gradeCompleta = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
                    let gradeFiltrada = tempoAtual < divisorTurno ? gradeCompleta.filter(h => parseInt(h.split(':')[0]) < 12) : gradeCompleta.filter(h => parseInt(h.split(':')[0]) >= 12);
                    let nomeTurno = tempoAtual < divisorTurno ? "Manhã" : "Tarde";

                    res.render('dashboard', {
                        profissionais: profissionais || [],
                        agendamentos: rowsAgendamentos || [],
                        dataHoje: dataExibicao,
                        gradeHorarios: gradeFiltrada,
                        turno: nomeTurno,
                        stats: {
                            totalClientes: rowClientes ? rowClientes.total : 0,
                            agendadosHoje: rowsAgendamentos ? rowsAgendamentos.length : 0,
                            totalProfissionais: profissionais ? profissionais.length : 0
                        }
                    });
                });
            });
        });
    },

    // 2. LISTAR
    listar: (req, res) => {
        const sql = `SELECT id, paciente_nome, strftime('%d/%m/%Y', data) as data_br, data, hora, profissional_id, procedimento, status 
                     FROM agendamentos ORDER BY data DESC, hora ASC`;
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).send("Erro ao listar.");
            res.render('agendamentos', { agendamentos: rows || [] });
        });
    },

    // 3. FORMULÁRIO NOVO
    formularioNovo: (req, res) => {
        res.render('novo_agendamento');
    },

    // 4. SALVAR NOVO COM INTEGRAÇÃO
    novo: (req, res) => {
        const { paciente_nome, nome, data, hora, profissional_id, procedimento, status } = req.body;
        const nomeFinal = paciente_nome || nome;

        const sql = `INSERT INTO agendamentos (paciente_nome, data, hora, profissional_id, procedimento, status) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [nomeFinal, data, hora, profissional_id, procedimento, status || 'Agendado'], function(err) {
            if (err) return res.status(500).send("Erro ao salvar.");
            
            const agendamentoId = this.lastID;
            db.get('SELECT id FROM clientes WHERE nome = ?', [nomeFinal], (err, cliente) => {
                const clienteId = cliente ? cliente.id : null;
                const dadosFinanceiros = {
                    cliente_id: clienteId,
                    cliente_nome: nomeFinal,
                    procedimento: procedimento,
                    data_realizada: data,
                    valor_total: 0,
                    forma_pagamento: 'A definir',
                    status: 'Pendente',
                    agendamento_id: agendamentoId
                };
                Faturamento.criarComParcelas(dadosFinanceiros, (err) => {
                    res.redirect('/agendamentos');
                });
            });
        });
    },

    // 5. EDITAR
    editar: (req, res) => {
        const id = req.params.id;
        db.get('SELECT * FROM agendamentos WHERE id = ?', [id], (err, row) => {
            if (err || !row) return res.status(404).send("Agendamento não encontrado.");
            res.render('editar-agendamento', { agendamento: row });
        });
    },

    // 6. ATUALIZAR
    atualizar: (req, res) => {
        const id = req.params.id;
        const { paciente_nome, nome, data, hora, profissional_id, procedimento, status } = req.body;
        const nomeFinal = paciente_nome || nome;
        const sql = `UPDATE agendamentos SET paciente_nome=?, data=?, hora=?, profissional_id=?, procedimento=?, status=? WHERE id=?`;
        db.run(sql, [nomeFinal, data, hora, profissional_id, procedimento, status, id], (err) => {
            if (err) return res.status(500).send("Erro ao atualizar.");
            res.redirect('/agendamentos');
        });
    },

    // 7. DELETAR
    deletar: (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM agendamentos WHERE id = ?', [id], (err) => {
            res.redirect('/agendamentos');
        });
    }
};

module.exports = agendamentosController;