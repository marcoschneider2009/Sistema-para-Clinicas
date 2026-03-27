const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

// Quando o usuário acessar /profissionais, o Controller entra em ação
router.get('/', relatoriosController.listar);


// Exportação obrigatória para o app.js reconhecer
module.exports = router;