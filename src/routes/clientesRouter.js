const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router(); 
const clientesController = require('../controllers/clientesController');

// 1. Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/clientes/'));
    },
    filename: function (req, file, cb) {
        const nomeArquivo = Date.now() + path.extname(file.originalname);
        cb(null, nomeArquivo);
    }
});

const upload = multer({ storage: storage });

// 2. Definição das Rotas

// Listagem e Edição (GET)
router.get('/', clientesController.index);
router.get('/editar/:id', clientesController.editar);
router.get('/relatorio/:id', clientesController.gerarRelatorio);

// --- AS ROTAS QUE ESTAVAM COM ERRO (POST) ---

// NOVO: Agora aceita o campo 'foto' como um campo de array
router.post('/novo', upload.fields([
    { name: 'foto', maxCount: 1 }
]), clientesController.novo);

// ATUALIZAR: Aceita 'foto' e a galeria de 'exames'
router.post('/atualizar/:id', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'exames', maxCount: 20 }
]), clientesController.atualizar);

// DELETAR
router.post('/deletar/:id', clientesController.deletar);

// Rota para EXCLUIR UM EXAME individualmente (Novo)
// Passamos o ID do cliente para saber para onde voltar e o ID do exame para saber o que deletar
router.post('/excluir-exame/:clienteId/:exameId', clientesController.excluirExame);

module.exports = router;