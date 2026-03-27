const express = require('express');
const path = require('path');
const app = express();

/* --- 1. CONFIGURAÇÃO DE VIEW ENGINE --- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

/* --- 2. MIDDLEWARES (ESSENCIAIS) --- 
   Essas linhas permitem que o Express entenda os dados vindo dos formulários (POST).
*/
app.use(express.urlencoded({ extended: true })); // Lê dados de formulários comuns
app.use(express.json());                         // Lê dados em formato JSON

/* --- 3. ARQUIVOS ESTÁTICOS --- */
app.use(express.static(path.join(__dirname, '../public')));

/* --- 4. IMPORTAÇÃO DE ROTAS (CAMINHOS DOS ARQUIVOS) --- */
const dashboardRouter     = require('./routes/dashboardRouter');
const clientesRouter      = require('./routes/clientesRouter');
const agendamentosRouter  = require('./routes/agendamentosRouter');
const profissionaisRouter = require('./routes/profissionaisRouter');
const escalasRouter       = require('./routes/escalasRouter');
const faturamentoRouter   = require('./routes/faturamentoRouter');
const relatoriosRouter    = require('./routes/relatoriosRouter');
const marketingRouter     = require('./routes/marketingRouter');
const backupRouter        = require('./routes/backupRouter');

/* --- 5. APLICAÇÃO DAS ROTAS (PREFIXOS) --- 
   Aqui definimos que toda rota de cliente começará com /clientes
*/
app.use('/dashboard', dashboardRouter);
app.use('/clientes', clientesRouter);       // Se o form envia para /clientes/deletar, ele entra aqui
app.use('/agendamentos', agendamentosRouter);
app.use('/profissionais', profissionaisRouter);
app.use('/escalas', escalasRouter);
app.use('/faturamento', faturamentoRouter);
app.use('/relatorios', relatoriosRouter);
app.use('/marketing', marketingRouter);
app.use('/backup', backupRouter);

/* --- 6. REDIRECIONAMENTO INICIAL --- */
app.get('/', (req, res) => res.redirect('/dashboard'));

/* --- 7. INICIALIZAÇÃO DO SERVIDOR --- */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`Aura System Online: http://localhost:${PORT}`);
    console.log(`Rodando em modo de teste de visualização`);
    console.log(`=========================================\n`);
});