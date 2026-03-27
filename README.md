# Aura System | Gestão e Agendamento para Clínicas

O **Aura System** é uma solução completa para automação de processos clínicos, permitindo a gestão eficiente de agendamentos, profissionais, pacientes e faturamento. Desenvolvido com foco em usabilidade e performance, o sistema utiliza uma arquitetura robusta para garantir a escalabilidade do projeto.

## 🚀 Funcionalidades

- **Dashboard Administrativo:** Visão geral das operações da clínica.
- **Gestão de Agendamentos:** Agenda dinâmica com visualização por profissional e horário.
- **Cadastro de Pacientes e Profissionais:** CRUD completo para gestão de dados.
- **Controle de Escalas:** Organização de horários e disponibilidade da equipa.
- **Módulo de Faturamento:** Gestão financeira e processamento de atendimentos.
- **Backup de Dados:** Funcionalidade integrada para segurança da informação.
- **Interface Responsiva:** Design moderno e profissional utilizando EJS e CSS personalizado.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js com Express
- **Frontend:** EJS (Embedded JavaScript templates)
- **Base de Dados:** SQLite / MySQL (Arquitetura preparada para ambos)
- **Arquitetura:** MVC (Model-View-Controller)
- **Estilização:** CSS3 com foco em UI/UX corporativo

## 📂 Estrutura do Projeto

```text
src/
├── controllers/    # Lógica de negócio e controlo das rotas
├── models/         # Definição de esquemas e interação com banco de dados
├── routes/         # Definição dos pontos de extremidade (endpoints)
├── views/          # Templates EJS (Interface do utilizador)
├── public/         # Ficheiros estáticos (CSS, JS, Imagens)
└── database/       # Configurações de persistência de dados
