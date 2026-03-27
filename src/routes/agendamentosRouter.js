const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');

// 1. Rota para a lista de agendamentos
router.get('/', agendamentosController.listar);

// 2. Rota para o formulário de novo agendamento
router.get('/novo', agendamentosController.formularioNovo);

// 3. Rota para salvar o novo agendamento (POST)
router.post('/novo', agendamentosController.novo);

// 4. Rota para abrir a tela de edição
router.get('/editar/:id', agendamentosController.editar);

// 5. Rota para salvar a atualização (POST)
router.post('/editar/:id', agendamentosController.atualizar);

// 6. Rota para deletar um agendamento
router.get('/deletar/:id', agendamentosController.deletar);

module.exports = router;