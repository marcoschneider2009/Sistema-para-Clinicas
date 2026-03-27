const relatoriosController = {
    listar: (req, res) => {
        // Dados de teste para visualização
        res.render('relatorios', { 
            titulo: 'Gestão de Relatorios - Aura System',
            dados: {
                status: "Automação Clínica Ativa",
                usuario: "Marco A. Schneider"
            }
        });
    }
};

module.exports = relatoriosController;