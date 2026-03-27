const express = require('express');
const router = express.Router();
// Importamos o controller que contém a lógica do dashboard
const agendamentosController = require('../controllers/agendamentosController');

// O segredo: você deve especificar a função .dashboard
router.get('/', agendamentosController.dashboard);

module.exports = router;