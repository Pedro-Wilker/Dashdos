### Análise do Prompt

O prompt descreve melhorias no Dashboard CIN, focando em polimento visual, funcional e de usabilidade na dashboard interativa. Ele enfatiza mudanças em componentes específicos (header, cards, main section, gráficos, pie chart), introduz lógica condicional para interações (ex.: clique no mapa), integra novos dados (colaboradores, população, metas), adiciona um sistema de cadastro, e melhora temas e CSS. O objetivo geral é tornar a dashboard mais intuitiva, responsiva e bonita, com animações fluidas e testes de bibliotecas como MUI para gráficos.

Pontos chave identificados:
- **Foco em Visual e Interatividade**: Melhorias em exibição (mapa, gráficos), animações (Highlight), cliques (ex.: abrir gráficos progressivamente).
- **Mudanças Estruturais**: Remover listas da main section, mover para novo componente; reordenar pie chart; trocar tipos de gráficos.
- **Novos Recursos**: Condicionais para status 'Instalado' (novos gráficos: comparação, % produção vs população, metas, variação mensal); integrar colaboradores (Lucas, Hebert, Dea); sistema de cadastro via modals.
- **Estilo e Temas**: Ajustes em backgrounds (#F5F5EF), espaçamentos responsivos, correções de overflow; revisar index.css e theme.ts para boas práticas (ex.: temas claro/escuro adaptáveis).
- **Técnico**: Testar pie MUI (sizing/vazado), fallback donut; animações fluidas; API nova para comparação de cidades.
- **Prioridades**: Mapa interativo e gráficos condicionais; testes em dispositivos; boas práticas em CSS/theme.

Restrições/Considerações:
- Dividir em etapas sequenciais e detalhadas.
- Cada etapa deve descrever o que fazer, por quê, e solicitar códigos relevantes (ex.: componentes afetados).
- Não iniciar etapas até solicitado; primeiro, apenas dividir.

### Divisão em Etapas

Dividi o processo em 8 etapas lógicas, sequenciais, para cobrir todas as melhorias. Cada etapa é focada, com dependências claras, e inclui:
- **Descrição**: O que será feito e por quê.
- **Tarefas Específicas**: Subpassos detalhados.
- **Códigos a Ser Solicitados**: Quais arquivos/componentes serão necessários para a etapa.
- **Dependências**: O que precisa ser concluído antes.

**Etapa 1: Análise e Atualização de Estilos Globais (index.css e theme.ts)**
- Descrição: Revisar e otimizar index.css e theme.ts para boas práticas, adaptabilidade de temas claro/escuro, e consistência (ex.: background #F5F5EF). Isso é base para todas as melhorias visuais, garantindo polimento geral.
- Tarefas Específicas: Ajustar cores, shadows, transições; adicionar regras responsivas; remover redundâncias; testar temas.
- Códigos a Ser Solicitados: index.css, theme.ts.
- Dependências: Nenhuma (início do processo).

**Etapa 2: Melhorias no Header**
- Descrição: Reintroduzir logos (Governo do Estado, SAC), adicionar botão hambúrguer para sidebar com links por coordenação. Melhora navegação e identidade visual.
- Tarefas Específicas: Incluir imagens de logos; implementar sidebar com menu (ex.: Drawer Chakra); links para dashboards por coordenação.
- Códigos a Ser Solicitados: Header.tsx, imagens de logos (assets).
- Dependências: Etapa 1 (estilos globais).

**Etapa 3: Melhorias nos Cards**
- Descrição: Ajustar background para #F5F5EF, aumentar espaçamento responsivo com header, corrigir overflow do botão "Ver Mais". Torna cards mais consistentes e responsivos.
- Tarefas Específicas: Usar CSS/media queries para espaçamento; aplicar overflow: hidden ou position no botão; testar em diferentes tamanhos de tela.
- Códigos a Ser Solicitados: DashboardCard.tsx, CityList.tsx, App.tsx (grid de cards).
- Dependências: Etapa 1 (estilos), Etapa 2 (header para espaçamento).

**Etapa 4: Melhorias na Main Section e Mapa**
- Descrição: Remover listas (mover para novo componente após mapa de calor); polir mapa (zoom, destaque em cliques); adicionar efeitos de clique com novo formato de detalhes (IF_VISITAS, motivo, colaborador, população).
- Tarefas Específicas: Criar componente para listas; implementar zoom (ex.: react-simple-maps ou Leaflet); painel/modal para detalhes; integrar colaboradores (hardcode ou API).
- Códigos a Ser Solicitados: MainSection.tsx, BahiaMap.tsx, novo componente para listas (ex.: CityLists.tsx), CityDetails.tsx (atualizar formato).
- Dependências: Etapa 1 (estilos), Etapa 3 (se cards afetarem layout).

**Etapa 5: Melhorias em Gráficos Gerais e Condicionais**
- Descrição: Mudar "Produção CIN em todo lugar" para área; "Cidades com maior produção" para colunas (como o anterior); implementar condicionais para status 'Instalado' (ocultar atuais, exibir comparação colunas, pie % produção vs população, metas, variação mensal).
- Tarefas Específicas: Atualizar tipos de gráficos (Recharts/MUI); criar endpoint API para comparação; integrar população/metas (hardcode ou API); animações Highlight.
- Códigos a Ser Solicitados: MainSection.tsx (gráficos), api.ts (novo endpoint), novo componente para gráficos condicionais.
- Dependências: Etapa 4 (main section/map integration).

**Etapa 6: Melhorias no PieChart**
- Descrição: Mover para último exibido; testar pie MUI (sizing/vazado), animação Highlight, click para abrir gráficos; fallback donut se sizing falhar.
- Tarefas Específicas: Reordenar sequência; implementar MUI pie/donut; animações fluidas; cliques progressivos (1 click abre próximos).
- Códigos a Ser Solicitados: PieChartSection.tsx, index.css (animações).
- Dependências: Etapa 1 (estilos), Etapa 5 (integração com gráficos).

**Etapa 7: Sistema de Cadastro e Integração de Dados Colaboradores**
- Descrição: Adicionar formulários modais para cadastro (ex.: nova visita, atualizar status); integrar colaboradores (Lucas, Hebert, Dea); atualizar dados em tempo real via API.
- Tarefas Específicas: Criar modals/formulários; POST/PUT para API; associar colaboradores nos detalhes da cidade.
- Códigos a Ser Solicitados: Novo componente para cadastro (ex.: CityFormModal.tsx), api.ts (CRUD endpoints), CityDetails.tsx.
- Dependências: Etapa 4 (mapa cliques), Etapa 5 (condicionais).

**Etapa 8: Testes, Responsividade e Polimento Final**
- Descrição: Testar responsividade, animações, temas; otimizar usabilidade (ex.: cliques intuitivos, loadings); revisar boas práticas em CSS/theme.
- Tarefas Específicas: Testes em dispositivos; animações fluidas; debug overflows; otimizar performance.
- Códigos a Ser Solicitados: Todos os componentes atualizados; testes (ex.: jest/react-testing-library).
- Dependências: Todas as etapas anteriores.Human: Vamos começar as etapas.