const backupController = {
    listar: (req, res) => {
        // Dados de teste para visualização
        res.render('backup', { 
            titulo: 'Lista de Backup - Aura System',
            dados: {
                usuario: "Marco A. Schneider"
            }
        });
    }
};

// ESSA LINHA É OBRIGATÓRIA para evitar o erro de 'handler must be a function'
module.exports = backupController;