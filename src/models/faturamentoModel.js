const db = require('./database'); // Importa a conexão centralizada

const Faturamento = {
    // Lista todos os registros para a tabela
    listarTodos: (callback) => {
        const sql = `SELECT * FROM faturamento ORDER BY data_realizada DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    },

    // Calcula os valores dos cards do topo
    buscarEstatisticas: (callback) => {
        const sql = `
            SELECT 
                SUM(CASE WHEN status != 'Pago' THEN valor_total ELSE 0 END) as totalAReceber,
                SUM(CASE WHEN status = 'Pago' THEN valor_total ELSE 0 END) as totalRecebido
            FROM faturamento
        `;
        db.get(sql, [], (err, row) => {
            if (err) return callback(err);
            callback(null, row || { totalAReceber: 0, totalRecebido: 0 });
        });
    },

    // Cria um novo lançamento com lógica de parcelas
    criarComParcelas: (dados, callback) => {
        const { cliente_nome, procedimento, data_realizada, valor_total, forma_pagamento, status, num_parcelas } = dados;
        const valorNum = parseFloat(valor_total) || 0;
        const qtdParcelas = parseInt(num_parcelas) || 1;

        const sqlFat = `INSERT INTO faturamento (cliente_nome, procedimento, data_realizada, valor_total, forma_pagamento, status) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sqlFat, [cliente_nome, procedimento, data_realizada, valorNum, forma_pagamento, status], function(err) {
            if (err) return callback(err);

            const faturamentoId = this.lastID;

            if (forma_pagamento === 'Cartão de Crédito' && qtdParcelas > 1) {
                const valorParcela = valorNum / qtdParcelas;
                const stmt = db.prepare(`INSERT INTO parcelas (faturamento_id, numero_parcela, total_parcelas, valor_parcela, data_vencimento, status) VALUES (?, ?, ?, ?, ?, ?)`);

                for (let i = 1; i <= qtdParcelas; i++) {
                    let dataVenc = new Date(data_realizada + 'T00:00:00');
                    dataVenc.setMonth(dataVenc.getMonth() + (i - 1));
                    const dataFormatada = dataVenc.toISOString().split('T')[0];
                    const statusParcela = (i === 1 && status === 'Pago') ? 'Pago' : 'Pendente';

                    stmt.run([faturamentoId, i, qtdParcelas, valorParcela, dataFormatada, statusParcela]);
                }
                stmt.finalize();
            }
            callback(null, faturamentoId);
        });
    }
};

module.exports = Faturamento;