const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router(); 
const profissionaisController = require('../controllers/profissionaisController');

// 1. Configuração do Multer (Mantendo seu padrão de fotos)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/profissionais/'));
    },
    filename: function (req, file, cb) {
        const nomeArquivo = Date.now() + path.extname(file.originalname);
        cb(null, nomeArquivo);
    }
});

const upload = multer({ storage: storage });

// 2. Definição das Rotas - LIMPAS

// Listagem (GET) - Agora chama 'listar' e não 'index'
router.get('/', profissionaisController.listar);

// Abrir formulário de novo profissional (GET)
router.get('/novo', profissionaisController.formularioNovo);

// Editar (GET) - Abre a tela editar-profissional.ejs
router.get('/editar/:id', profissionaisController.editar);


// --- ROTAS DE AÇÃO (POST) ---

// NOVO: Salvar no banco
router.post('/novo', upload.fields([
    { name: 'foto', maxCount: 1 }
]), profissionaisController.novo);

// ATUALIZAR: Salvar alterações
router.post('/atualizar/:id', upload.fields([
    { name: 'foto', maxCount: 1 }
]), profissionaisController.atualizar);

// DELETAR (Ajustado para GET ou POST conforme seu padrão de clique)
router.post('/deletar/:id', profissionaisController.deletar);

module.exports = router;