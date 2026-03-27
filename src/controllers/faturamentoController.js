const Faturamento = require('../models/faturamentoModel');

exports.exibirFaturamento = (req, res) => {
    Faturamento.listarTodos((err, lancamentos) => {
        if (err) {
            console.error("Erro ao listar faturamento:", err);
            return res.status(500).send("Erro interno no servidor.");
        }

        Faturamento.buscarEstatisticas((err, stats) => {
            if (err) return res.status(500).send("Erro ao buscar estatísticas.");

            // Formatação para exibição na View
            const lancamentosFormatados = lancamentos.map(l => ({
                ...l,
                valor_total_br: (l.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                data_realizada_br: l.data_realizada ? new Date(l.data_realizada + 'T00:00:00').toLocaleDateString('pt-BR') : '---'
            }));

            res.render('faturamento', { 
                lancamentos: lancamentosFormatados, 
                stats: {
                    totalAReceber: (stats.totalAReceber || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                    totalRecebidoMes: (stats.totalRecebido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                },
                path: '/faturamento' 
            });
        });
    });
};

exports.salvarFaturamento = (req, res) => {
    const dados = req.body;
    
    // Tratamento básico de dados vindo do formulário
    if (!dados.valor_total) dados.valor_total = 0;
    
    Faturamento.criarComParcelas(dados, (err) => {
        if (err) {
            console.error("Erro ao salvar lançamento:", err);
            return res.status(500).send("Erro ao salvar faturamento.");
        }
        res.redirect('/faturamento');
    });
};