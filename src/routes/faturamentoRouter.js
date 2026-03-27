const express = require('express');
const router = express.Router();
const faturamentoController = require('../controllers/faturamentoController');

// Rota principal: exibe a tabela e os cards (GET /faturamento)
router.get('/', faturamentoController.exibirFaturamento);

// Rota para processar o formulário do Modal (POST /faturamento/novo)
router.post('/novo', faturamentoController.salvarFaturamento);

module.exports = router;