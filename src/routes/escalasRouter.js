const express = require('express');
const router = express.Router();
const escalasController = require('../controllers/escalasController');

// Rota para exibir a página (GET)
router.get('/', escalasController.listar);

// ROTA QUE ESTÁ FALTANDO: Salvar escala (POST)
router.post('/salvar', escalasController.salvar);

// Rota para deletar (GET ou POST conforme sua preferência)
router.get('/deletar/:id', escalasController.deletar);

module.exports = router;