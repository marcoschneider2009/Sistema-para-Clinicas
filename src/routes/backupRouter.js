const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

// Verifique se o nome da função no controller está correto
router.get('/', backupController.listar);
router.get('/backup', backupController.listar);


// ESSA LINHA É OBRIGATÓRIA - Se faltar, o app.js crasha
module.exports = router;