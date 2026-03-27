const marketingController = {
    listar: (req, res) => {
        // Dados de teste para visualização
        res.render('marketing', { 
            titulo: 'Gestão de Marketing - Aura System',
            dados: {
                status: "Automação Clínica Ativa",
                usuario: "Marco A. Schneider"
            }
        });
    }
};

module.exports = marketingController;
