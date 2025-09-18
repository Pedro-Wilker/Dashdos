# Dashboard Interativa

- Melhorias da exibição dos componentes, todos os componentes precisam estar mais polidos, uma melhoria na exibição do mapa, dos graficos.

## Graficos

- Produção CIN em todo lugar: Esse grafico deve ser um grafico de area, pontos importantes: Forma como os graficos vao ser exibidos.
- Cidades com maior produção de cins, mudança do grafico coluna utilizado atualmente, passaremos a utilizar o grafico de colunas que hoje é utilizado no Produção CIN em todo lugar.

### PieChart

- A exibição do piechart não será mais o segundo a ser exibido, passara agora a ser o ultimo exibido.
- Vamos passar a utilizar graficos diferentes do piechart, vamos testar primeiro a utilização:
-- Sizing, grafico do tipo pie da lib mui, um tipo de grafico vazado e de facil uso, todos os graficos devem ter animação fluidas, a animação utilizada vai ser a Highlight, vamos utilizar o Click event, com 1 click abrindo já os proximos graficos, somente o primeiro click vai abrir o grafico.
-- Caso o Sizing não fique correto utilizaremos o donut como alterantiva de pie chart.


# Aqui estão melhorias tecnitcas pensadas ao decorrer do tempo de desenvolvimento

## Dashboard Interativa

### Melhorias

- Header:
-- A header vai ter novamente a exibição das logos, do governo do estado(consegui a logo do sac).
-- Botão Hamburguer para abrir a sidebar(terá as telas de cada dashboard interativa para cada uma das cordenações).

- Card:
-- Atualmente o background dos cards não esta se adaptando ao background utilizado para dashboard, ele deve ter a cor de fundo utilzada por outros componentes. #F5F5EF
-- Aumentar responsivimente o espaço dos cards com a header.
-- Controlar botão de ver mais, atualmente está saindo do espaço demandando por sua div pai.

- Main Section:
-- Remover listas de dentro da main section, não vão ser mais exibidos na main section, vão ter um componente proprio depois do mapa de calor.
-- Melhoria da visualização do mapa a ser feita, os mapas precisam funções de cliques devem retornar, como por exemplo utilma cidade clicada mudando de cor, função de zoom deve ser colocada novamente no mapa.

-- Efeitos quando o usuario clicar no mapa:
--- Uma lista com dados da cidade devem aparecer, atualmente:
        Detalhes de Camaçari
        Nome: Camaçari
        Status Visita: Reprovado
        Status Publicação: aguardando_publicacao
        Status Instalação: aguardando_instalacao
        Data Visita: 2025-09-15T00:00:00.000Z
        Data Instalação: 2025-09-20T00:00:00.000Z
--- Vamos mudar a exibição para a seguinte forma:
        Detalhes da ${Cidade}
        (IF_VISITAS)
        nome, visita(status e data), publicacao(status e data), instalacao(status e data), Visita reprovada: Motivo, Colaborador que visitou, se tiver, população da cidade.
--- Ao clicar na cidade e o status_instalacao for = Instalado, os graficos de Produção CIN em todo lugar e Cidades com maior produção de CINs, vão deixar de ser exibidos, vamos entrar agora para graficos com:
    Comparação entre cidades(criar uma roda na api para isso), onde vai comparar a produção da cidade com maior produção de cins, será um grafico de coluna comparando ambas as cidades.
    Um grafico pie que retorna a % que é a produção total da cidade em comparação com a populção da cidade.
    Dados da meta anual, mensal e diaria e se a cidade esta ou não dentro da media
    Cidade aumentou ou diminuiu a produção de cins em relação a outros meses?

## Duvidas, é possivel adicionar dados de nossos colaboradores

Sim for possivel, quais dados vão ser utilizados? Colobarador que visitou?
-> Lucas, Hebert e Dea.

-Sistema de cadastro, com interação direta com a dashboard.


# Prompt Melhorado: Especificações Detalhadas para Melhorias na Dashboard Interativa

## Objetivo Geral
Criar uma dashboard interativa mais polida, responsiva e intuitiva, com foco em melhorias visuais e funcionais nos componentes (header, cards, main section, mapa e gráficos). Todos os elementos devem ser otimizados para usabilidade, incluindo animações fluidas (usar animação "Highlight" em gráficos) e interações via cliques. Priorizar testes com bibliotecas como MUI para gráficos. Integrar dados de colaboradores (ex.: Lucas, Hebert e Dea) onde relevante, como no campo "Colaborador que visitou". Adicionar um sistema de cadastro com interação direta na dashboard (ex.: formulários modais ou overlays que atualizam dados em tempo real).

## Especificações por Seção

### Header
- *Logos*: Reintroduzir exibição das logos do Governo do Estado e do SAC (logo do SAC já obtida).
- *Navegação*: Incluir botão hambúrguer para abrir sidebar com links para dashboards interativas de cada coordenação (ex.: itens de menu dedicados por coordenação).

### Cards
- *Estilo Visual*:
  - Ajustar background dos cards para herdar a cor de fundo da dashboard (#F5F5EF), garantindo consistência com outros componentes.
  - Aumentar espaçamento responsivo entre cards e header (usar media queries para telas mobile/desktop).
- *Botão "Ver Mais"*:
  - Corrigir overflow: Garantir que o botão fique contido na div pai, sem ultrapassar limites (usar CSS como overflow: hidden ou position: relative).

### Main Section
- *Listas*:
  - Remover todas as listas da main section. Criar um componente dedicado para exibi-las após o mapa de calor (ex.: um accordion ou modal expansível).
- *Mapa de Calor*:
  - *Melhorias Visuais e Funcionais*:
    - Polir exibição geral: Melhorar zoom (reimplementar função de zoom nativa ou via biblioteca como Leaflet/React-Leaflet).
    - Restaurar interações de clique: Ao clicar em uma cidade, destacar a última cidade clicada mudando sua cor (ex.: borda ou preenchimento em destaque).
  - *Efeitos de Clique no Mapa*:
    - Exibir um painel ou modal com detalhes da cidade selecionada.
    - *Formato Atual (a remover)*:
      
      Detalhes de Camaçari
      Nome: Camaçari
      Status Visita: Reprovado
      Status Publicação: aguardando_publicacao
      Status Instalação: aguardando_instalacao
      Data Visita: 2025-09-15T00:00:00.000Z
      Data Instalação: 2025-09-20T00:00:00.000Z
      
    - *Novo Formato*:
      
      Detalhes da ${Cidade}
      Nome: ${Cidade}
      Visita: Status (${Data Visita}) | Se reprovada: Motivo
      Publicação: Status (${Data Publicação})
      Instalação: Status (${Data Instalação})
      Colaborador que Visitou: ${Nome Colaborador} (ex.: Lucas, Hebert ou Dea, se aplicável)
      População da Cidade: ${População}
      
      - Condicional: Incluir seção "IF_VISITAS" apenas se houver visitas registradas.
    - *Lógica Condicional para Status de Instalação*:
      - Se status_instalacao === 'Instalado':
        - Ocultar gráficos "Produção CIN em todo lugar" e "Cidades com maior produção de CINs".
        - Exibir novos gráficos/componentes:
          - *Comparação entre Cidades*: Gráfico de colunas comparando a produção da cidade selecionada com a cidade de maior produção de CINs. (Criar endpoint na API: /api/comparacao-cidades?selectedCity=${Cidade}&topCity=true).
          - *Porcentagem de Produção vs. População*: Gráfico de pie (ver seção Gráficos abaixo) mostrando % da produção total da cidade em relação à população.
          - *Dados de Metas*: Exibir métricas de meta anual, mensal e diária, com indicador se a cidade está dentro da média (ex.: badge verde/vermelho ou texto "Dentro da Média" / "Abaixo da Média").
          - *Variação Mensal*: Texto ou gráfico de linha simples indicando se a produção de CINs aumentou/diminuiu em relação a meses anteriores (ex.: "+15% vs. Agosto" ou ícone de seta ↑/↓).
      - Integrar dados de colaboradores: Usar nomes como Lucas, Hebert e Dea no campo "Colaborador que visitou" (buscar via API ou banco de dados).

### Gráficos
- *Geral*:
  - Todos os gráficos devem ser polidos: Animações fluidas com "Highlight" (da lib MUI ou Recharts). Usar eventos de clique: Apenas o primeiro clique abre/expande o gráfico subsequente (ex.: onClick para toggle visibility).
  - Responsividade: Adaptar para diferentes tamanhos de tela.
- *Produção CIN em Todo Lugar*:
  - Tipo: Gráfico de área (area chart).
  - Detalhes: Focar na forma de exibição (ex.: eixos claros, tooltips com dados exatos, cores consistentes com tema #F5F5EF).
- *Cidades com Maior Produção de CINs*:
  - Mudança: Substituir gráfico de colunas atual pelo de colunas usado em "Produção CIN em Todo Lugar" (reutilizar componente para consistência).
- *Pie Chart (Substituição e Posicionamento)*:
  - *Ordem de Exibição*: Mover para o último gráfico na sequência (não mais o segundo).
  - *Novo Tipo*:
    - Testar primeiro: Gráfico de pie "Sizing" da lib MUI (estilo vazado/donut-like, fácil de usar).
    - Animações: Fluidas com "Highlight".
    - Interação: Click event – apenas o primeiro clique expande para gráficos subsequentes.
    - Fallback: Se o sizing não se adequar (ex.: distorção em responsivo), usar donut chart como alternativa.
  - *Uso Específico*: No caso de cidade instalada, usar para % produção total vs. população da cidade.

## Considerações Adicionais
- *Integração de Dados de Colaboradores*: Sim, possível. Utilizar: "Colaborador que visitou" (valores: Lucas, Hebert, Dea). Buscar via API e exibir condicionalmente nos detalhes da cidade.
- *Sistema de Cadastro*: Implementar formulário de cadastro integrado à dashboard (ex.: botão "Cadastrar Nova Visita" no mapa ou cards, abrindo modal com campos para status, datas, motivo, colaborador e população. Atualizar dados em tempo real via API).
- *Testes e Prioridades*: 
  - Priorizar: Mapa interativo e gráficos condicionais.
  - Testar em diferentes dispositivos para responsividade.
  - Tecnologias Sugeridas: React com MUI para UI, Recharts ou Chart.js para gráficos, Leaflet para mapa.

Este prompt é auto-contido, acionável e estruturado para minimizar ambiguidades, facilitando a geração de código ou protótipos pela IA. Se precisar de ajustes, forneça mais detalhes!


https://mui.com/x/react-charts/pie/#sizing