const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');

// Quando o usuário acessar /profissionais, o Controller entra em ação
router.get('/', marketingController.listar);


// Exportação obrigatória para o app.js reconhecer
module.exports = router;