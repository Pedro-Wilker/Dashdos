import streamlit as st
import requests
import json
from typing import Dict, Any, List

st.set_page_config(page_title="Documentação da API e Dashboard DOS", layout="wide")

st.sidebar.title("Navegação")
page = st.sidebar.radio(
    "Seções",
    ["Introdução", "Como Usar", "Rotas da API", 
     "Exemplos Práticos", "Estrutura da API", "CRUD, Services e Rotas", "Dashboard Frontend", "Dependências", "Integração API-Dashboard"]
)

BASE_URL: str = "http://localhost:3000/api"

def display_json(payload: Dict[str, Any] | List[Dict[str, Any]]) -> None:
    st.json(payload)

if page == "Introdução":
    st.title("Documentação da API e Dashboard DOS")
    st.markdown("""
    # Bem-vindo à Documentação da API e Dashboard DOS

    ## A **Dashboard DOS** é uma aplicação dividida em dois sistemas principais: **API (Backend)** e **Dashboard (Frontend)**. 
    
    ### API (api_cin):
    
    A API é uma aplicação Node.js com Express que gerencia dados de municípios da Bahia, focando em visitas, instalações, publicações e produtividades de CINs (Carteira de Identidade Nacional). Ela oferece endpoints para consultas gerais, breakdowns de status, rankings de cidades e detalhes por município. Desenvolvida com autenticação JWT (opcional), a API suporta operações CRUD para entidades como `AmploGeral` (municípios) e `ProdutividadeDiaria`.

    ### Dashboard (dashboard_cin):
    
    O frontend é uma aplicação React com Vite, Chakra UI para UI, TanStack Query para gerenciamento de dados, Recharts para gráficos e react-simple-maps para mapas interativos. A dashboard suporta dois modos: **Interativo** (com cartões, gráficos, mapa de calor e modals) e **Slideshow** (apresentação automática). Ela consome a API para visualizar status de municípios, produtividades e mapas da Bahia.

    Esta documentação, construída com Streamlit, explica como configurar, usar e testar ambos os sistemas. Use o menu na barra lateral para navegar pelas seções. Repositório completo: [GitHub Dashdos](https://github.com/Pedro-Wilker/Dashdos).
    """)

elif page == "Como Usar":
    st.title("Como Usar a API e Dashboard")
    st.markdown("""
    ## Passo a Passo para Configurar e Usar

    ### 1. Clonar o Repositório
    Clone o repositório do GitHub:
    ```bash
    git clone https://github.com/Pedro-Wilker/Dashdos.git
    cd Dashdos
    ```

    ### 2. Configurar a API (api_cin)
    - Entre na pasta `api_cin`:
      ```bash
      cd api_cin
      npm install  # Instala dependências (Express, jwt, etc.)
      ```
    - Crie `.env` na raiz de `api_cin`:
      ```env
      PORT=3000
      DB_HOST=localhost
      DB_PORT=5432
      DB_USER=postgres
      DB_PASSWORD=your_password  # Ex: 161011
      DB_NAME=dashdos_db
      JWT_SECRET=your_jwt_secret  # Ex: 5abc456e5b9b1f63f9335a55bed7e747
      ```
    - Configure o banco (PostgreSQL):
      ```bash
      # Crie o DB
      psql -U postgres -c "CREATE DATABASE dashdos_db;" ou abra o pgAdmin e crie o DB manualmente.
      # Inicie o prisma
      npx prisma generate
      # Migrações (se houver)
      npx prisma migrate --name init
      ```
    - Inicie o servidor:
      ```bash
      npm run dev  # Ou npm start
      ```
      A API estará em `http://localhost:3000/api`.

    ### 3. Configurar a Dashboard (dashboard_cin)
    - Entre na pasta `dashboard_cin`:
      ```bash
      cd ../dashboard_cin
      npm install  # Instala dependências (React, Chakra UI, Recharts, etc.)
      ```
    - Configure `vite.config.js` para proxy da API (se não existir):
      ```js
      export default {
        server: {
          proxy: {
            '/api': 'http://localhost:3000'
          }
        }
      };
      ```
    - Inicie o frontend:
      ```bash
      npm run dev
      ```
      A dashboard estará em `http://localhost:5173`.

    ### 4. Testar a Integração
    - No modo Interativo da dashboard, verifique se dados carregam (ex.: cartões de status, mapa da Bahia).
    - Use Insomnia/Postman para testar API isoladamente (veja seção "Rotas").
    - Certifique-se de que o backend roda antes do frontend (proxy redireciona `/api` para `localhost:3000`).

    ### 5. Modos da Dashboard
    - **Interativo**: Cartões expansíveis, gráficos, mapa com hover/clique.
    - **Slideshow**: Apresentação automática (ative no menu inicial).
    """)

elif page == "Rotas da API":
    st.title("Rotas da API")
    st.markdown("""
    ## Endpoints da API (api_cin)

    A API expõe endpoints REST para dados de municípios (AmploGeral) e produtividades. Base URL: `http://localhost:3000/api`. Não há autenticação obrigatória nos endpoints listados (adicione JWT se necessário).

    ### Amplo Geral (Municípios)
    #### `GET /api/amplo-geral`
    Lista todos os municípios com status de visitas, instalações e publicações.
    - **Query Params**: Nenhum obrigatório.
    - **Resposta (200)**:
    """)
    display_json([
        {
            "id": 1,
            "nome_municipio": "Salvador",
            "status_infra": "Fibra",
            "cidade_visita": True,
            "status_visita": "Aprovado",
            "status_publicacao": "publicado",
            "status_instalacao": "instalado",
            "produtividades_diarias": [{"data": "2025-04-05", "quantidade": 45}]
        }
    ])
    st.markdown("""
    #### `GET /api/amplo-geral/nome-municipio?nome_municipio=Salvador`
    Detalhes de um município específico, incluindo produtividades diárias.
    - **Query Params**: `nome_municipio` (string, ex: "Salvador").
    - **Resposta (200)**:
    """)
    display_json([
        {
            "id": 2,
            "nome_municipio": "Salvador",
            "status_infra": "Fibra",
            "periodo_visita": "2025-01-15T10:00:00.000Z",
            "status_visita": "Aprovado",
            "status_publicacao": "publicado",
            "status_instalacao": "instalado",
            "produtividades_diarias": [
                {"id": 4044, "data": "2025-04-05T00:00:00.000Z", "quantidade": 45}
            ]
        }
    ])
    st.markdown("""
    #### `GET /api/amplo-geral/visited-cities`
    Cidades visitadas com porcentagem.
    - **Resposta (200)**:
    """)
    display_json({
        "percentage": 65,
        "visitedCities": [{"nome_municipio": "Salvador"}]
    })
    st.markdown("""
    #### `GET /api/amplo-geral/status-visita-breakdown`
    Breakdown de status de visitas (Aprovado/Reprovado).
    - **Resposta (200)**:
    """)
    display_json({
        "approvedPercentage": 80,
        "rejectedPercentage": 20,
        "approvedCities": [{"nome_municipio": "Salvador"}],
        "rejectedCities": [{"nome_municipio": "Exemplo Reprovado"}]
    })
    st.markdown("""
    #### `GET /api/amplo-geral/status-publicacao-breakdown`
    Breakdown de publicações (Publicado/Aguardando).
    - **Resposta (200)**: Similar ao acima, adaptado para publicações.
    """)
    st.markdown("""
    #### `GET /api/amplo-geral/status-instalacao-breakdown`
    Breakdown de instalações (Instalado/Aguardando).
    - **Resposta (200)**: Similar ao acima, adaptado para instalações.
    """)

    st.markdown("""
    ### Produtividade
    #### `GET /api/produtividade/top-cities?ano=2025&limit=10`
    Top cidades por produção de CINs.
    - **Query Params**: `ano` (int, default 2025), `limit` (int, default 10).
    - **Resposta (200)**:
    """)
    display_json([
        {"nome_municipio": "Salvador", "total_quantidade": 1000}
    ])
    st.markdown("""
    #### `GET /api/produtividade/geral-mensal`
    Produção mensal geral de CINs.
    - **Resposta (200)**:
    """)
    display_json([
        {"monthYear": "2025-01", "quantidade": 500}
    ])
    st.markdown("""
    #### `GET /api/produtividade/top-and-least-cities?ano=2025&limit=5`
    Top e least cidades por produção.
    - **Query Params**: `ano` (int), `limit` (int).
    - **Resposta (200)**:
    """)
    display_json([
        {"nome_municipio": "Top Cidade", "total_quantidade": 1000},
        {"nome_municipio": "Least Cidade", "total_quantidade": 10}
    ])
    st.markdown("""
    #### `GET /api/produtividade/by-cidade/Salvador`
    Produtividade por cidade específica.
    - **Path Params**: Cidade (string).
    - **Resposta (200)**: Array de produtividades diárias.
    """)

elif page == "Exemplos Práticos":
    st.title("Exemplos Práticos")
    st.markdown("""
    ## Testando a API e Dashboard com Python (requests)

    Abaixo estão exemplos de como usar `requests` para interagir com a API. Certifique-se de que a API está rodando em `http://localhost:3000/api`. Para a dashboard, acesse `http://localhost:5173` após setup.

    ### Listar Municípios (Amplo Geral)
    ```python
    import requests

    url = "http://localhost:3000/api/amplo-geral"
    response = requests.get(url)
    print(response.status_code)  # 200
    print(response.json())  # Lista de municípios
    ```

    ### Detalhes de um Município
    ```python
    import requests

    url = "http://localhost:3000/api/amplo-geral/nome-municipio"
    params = {"nome_municipio": "Salvador"}
    response = requests.get(url, params=params)
    print(response.status_code)  # 200
    print(response.json())  # Detalhes + produtividades
    ```

    ### Top Cidades por Produtividade
    ```python
    import requests

    url = "http://localhost:3000/api/produtividade/top-cities"
    params = {"ano": 2025, "limit": 5}
    response = requests.get(url, params=params)
    print(response.status_code)  # 200
    print(response.json())  # Top 5 cidades
    ```

    ### Breakdown de Status de Visitas
    ```python
    import requests

    url = "http://localhost:3000/api/amplo-geral/status-visita-breakdown"
    response = requests.get(url)
    print(response.status_code)  # 200
    print(response.json())  # Porcentagens e listas
    ```

    ### Teste Interativo
    Insira o nome de um município para testar detalhes diretamente:
    """)
    cidade: str = st.text_input("Nome do Município", value="Salvador")
    if cidade:
        try:
            url = f"{BASE_URL}/amplo-geral/nome-municipio"
            params = {"nome_municipio": cidade}
            response = requests.get(url, params=params)
            st.write(f"**Status Code**: {response.status_code}")
            if response.status_code == 200:
                st.json(response.json())
            else:
                st.error(f"Erro: {response.text}")
        except requests.RequestException as e:
            st.error(f"Erro ao chamar a API: {e}")

    st.markdown("""
    ### Usando a Dashboard
    - Acesse `http://localhost:5173` e selecione "Modo Interativo".
    - Clique em cartões para ver listas de cidades.
    - No mapa da Bahia (MainSection), clique em cidades para detalhes.
    - Na HeatMapSection (abaixo de PieChart), expanda para tabela paginada e modals.
    - Exporte gráficos/tabelas via botões (PNG/CSV).
    """)

elif page == "Estrutura da API":
    st.title("Estrutura da API (api_cin)")
    st.markdown("""
    ## Arquitetura do Backend

    O projeto `api_cin` é uma API RESTful em Node.js/Express com Express para ORM (PostgreSQL). Estrutura de pastas:

    ```
    api_cin/
    ├── src/
    │   ├── prisma/
    │   │   └── migrations/ # Migrações do banco (se usar Prisma)
    │   │   └── schema.prisma  # Definição do schema (modelos, relações)
    │   ├── controllers/
    │   │   ├── AmploGeralController.js  # Lógica de endpoints (getAll, getByNome, breakdowns)
    │   │   └── ProdutividadeController.js  # Controladores para produtividades (top-cities, geral-mensal)
    │   ├── middlewares/ # Middleware (ex.: auth JWT, error handling) 
    │   │   └── auth.ts # Middleware de autenticação JWT
    │   └── services/
    │       └── AmploGeralService.js  # Queries SQL/filtros (ex.: top cities por ano)
    │   └── route.ts # Define rotas e conecta controllers
    │   └── server.ts # Entrada principal (Express app, conecta DB, monta rotas) 
    ├── .env  # Variáveis (DB_HOST, JWT_SECRET, etc.)
    ├── package.json  # Dependências: express, cors, dotenv
    └── README.md  # Setup básico
    ```

    **Fluxo Geral**:
    - `server.ts`: Inicializa Servidor.
    - `route.ts` (`routes/amploGeralRoutes.js`): Mapeiam URLs para controllers (ex.: GET /amplo-geral → AmploGeralController.getAll).
    - Controllers: Chamam services para lógica (ex.: AmploGeralService filtra por status/ano).
    - Services: Executam queries (ex.: findAll com where para breakdowns).
    - Prisma: schema.prisma. # Define modelos (AmploGeral, ProdutividadeDiaria) e relações (1:N).

    Exemplo de Código em `server.ts`:
    ```ts
        import express from 'express';
        import cors from 'cors';
        import dotenv from 'dotenv';
        import 'express-async-errors'; 
        import { PrismaClient } from '@prisma/client';
        import routes from './routes'; 

        dotenv.config();

        const app = express();
        const prisma = new PrismaClient();

        app.use(cors());
        app.use(express.json());

        // Middleware global para log de requests 
        app.use((req, res, next) => {
          console.log(`${req.method} ${req.url}`);
          next();
        });

        // Conecta as rotas
        app.use('/api', routes);

        // Tratamento de erros global
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
          console.error(err.stack);
          res.status(500).json({ error: 'Internal Server Error' });
        });

        // Desconecta Prisma ao encerrar o app
        process.on('SIGINT', async () => {
          await prisma.$disconnect();
          process.exit(0);
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
    ```
    """)

elif page == "CRUD, Services e Rotas":
    st.title("CRUD, Services e Rotas na API")
    st.markdown("""
    ## Como Funciona o CRUD, Services e Rotas

    A API usa padrão MVC (Model-View-Controller), com Services para lógica de negócio. Não há "View" (é API REST), mas controllers lidam com respostas JSON.

    ### CRUD em AmploGeral (Municípios)
    - **Model (Prisma)**: `schema.prisma` define `AmploGeral` e `ProdutividadeDiaria` com campos e relações.
    - **Service (`AmploGeralService.js`)**: Contém funções para operações CRUD e queries complexas.
      Exemplo: `CreateAmploGeralService.ts`
      ```ts
        import { PrismaClient, Cargo, StatusVisita, StatusPublicacao, StatusInstalacao } from '@prisma/client';
        import jwt from 'jsonwebtoken';

        const prisma = new PrismaClient();

        interface CreateAmploGeralData {
          nome_municipio: string;
          status_infra: string;
          cidade_visita: boolean;
          periodo_visita?: Date;
          periodo_instalacao?: Date;
          data_visita?: Date;
          data_instalacao?: Date;
          status_visita: StatusVisita;
          status_publicacao: StatusPublicacao;
          status_instalacao: StatusInstalacao;
          publicacao: Date;
        }

        export class CreateAmploGeralService {
          async execute(data: CreateAmploGeralData, token: string) {
            if (!process.env.JWT_SECRET) {
              throw new Error('JWT_SECRET não foi configurada');
            }

            let decoded: any;
            try {
              decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
              throw new Error('Token inválido');
            }

            const allowedRoles = [Cargo.ADMIN, Cargo.DIRETORIA, Cargo.CARTA];
            if (!allowedRoles.includes(decoded.cargo)) {
              throw new Error('Usuário não tem permissão para criar dados em Amplo Geral');
            }

            const existingRecord = await prisma.cin_amplo_geral.findUnique({
              where: { nome_municipio: data.nome_municipio },
            });

            if (existingRecord) {
              throw new Error('Este município já possui cadastro');
            }

            const amploGeral = await prisma.cin_amplo_geral.create({
              data: {
                nome_municipio: data.nome_municipio,
                status_infra: data.status_infra,
                cidade_visita: data.cidade_visita,
                periodo_visita: data.cidade_visita ? data.periodo_visita : null,
                periodo_instalacao: data.cidade_visita ? data.periodo_instalacao : null,
                data_visita: !data.cidade_visita ? data.data_visita : null,
                data_instalacao: !data.cidade_visita ? data.data_instalacao : null,
                status_visita: data.status_visita,
                status_publicacao: data.status_publicacao,
                status_instalacao: data.status_instalacao,
                publicacao: data.publicacao,
              },
            });

            return { message: 'Amplo Geral criado', amploGeralId: amploGeral.id };
          }
        }
      ```
      - ** Controller (`AmploGeralController.js`)**: Recebe requests, chama services e retorna respostas.
      Exemplo: `AmploGeralController.ts`
      ```ts
          import { Request, Response } from 'express';
          import { CreateAmploGeralService } from '../../services/AmploGeral/CreateAmploGeralService';
          import { StatusVisita, StatusPublicacao, StatusInstalacao } from '@prisma/client';

          export class CreateAmploGeralController {
            async handle(req: Request, res: Response) {
              const registros = req.body;
              const token = req.headers.authorization?.split(' ')[1];

              if (!token) {
                return res.status(400).json({ error: 'Token inválido' });
              }

              if (!Array.isArray(registros) || registros.length === 0) {
                return res.status(400).json({ error: 'Nenhum registro enviado.' });
              }

              const service = new CreateAmploGeralService();
              const resultados = [];

              for (const registro of registros) {
                const {
                  nome_municipio,
                  status_infra,
                  cidade_visita,
                  periodo_visita,
                  periodo_instalacao,
                  data_visita,
                  data_instalacao,
                  status_visita,
                  status_publicacao,
                  status_instalacao,
                  publicacao,
                } = registro;

                // Validação dos campos obrigatórios
                if (
                  !nome_municipio ||
                  !status_infra ||
                  cidade_visita === undefined ||
                  !status_visita ||
                  !status_publicacao ||
                  !status_instalacao ||
                  !publicacao
                ) {
                  return res.status(400).json({
                    error: `Campos obrigatórios ausentes no município "${nome_municipio}".`,
                  });
                }

                if (cidade_visita) {
                  if (!periodo_visita || !periodo_instalacao) {
                    return res.status(400).json({
                      error: `Para cidades com visita, período de visita e instalação são obrigatórios no município "${nome_municipio}".`,
                    });
                  }
                } else {
                  if (!data_visita || !data_instalacao) {
                    return res.status(400).json({
                      error: `Para cidades sem visita, data de visita e instalação são obrigatórios no município "${nome_municipio}".`,
                    });
                  }
                }

                try {
                  const result = await service.execute(
                    {
                      nome_municipio,
                      status_infra,
                      cidade_visita,
                      periodo_visita: cidade_visita ? new Date(periodo_visita) : undefined,
                      periodo_instalacao: cidade_visita ? new Date(periodo_instalacao) : undefined,
                      data_visita: !cidade_visita ? new Date(data_visita) : undefined,
                      data_instalacao: !cidade_visita ? new Date(data_instalacao) : undefined,
                      status_visita,
                      status_publicacao,
                      status_instalacao,
                      publicacao: new Date(publicacao),
                    },
                    token
                  );
                  resultados.push(result);
                } catch (error: any) {
                  return res.status(400).json({
                    error: `Erro ao criar município "${nome_municipio}": ${error.message}`,
                  });
                }
              }

              return res.status(201).json({
                message: 'Registros criados com sucesso.',
                resultados,
              });
            }
          }
      ```
      - Chama service para dados, envia JSON ou erro.

    - **Rotas (`route.ts`)**: Conectam URLs a controllers.
      Exemplo:
      ```js
          import { Router } from 'express';
          import { PrismaClient } from '@prisma/client';
          import { authMiddleware } from './middlewares/auth';

          import { AuthUserController } from './controllers/Users/AuthUserController';
          import { CreateUserController } from './controllers/Users/CreateUserController';
          import { UpdateUserController } from './controllers/Users/UpdateUserController';
          import { UpdatePasswordController } from './controllers/Users/UpdatePasswordController';
          import { RequestResetPasswordController } from './controllers/Users/RequestResetPasswordController';
          import { ConfirmResetPasswordController } from './controllers/Users/ConfirmResetPasswordController';

          import { CreateAmploGeralController } from './controllers/AmploGeral/CreateAmploGeralController';
          import { UpdateAmploGeralController } from './controllers/AmploGeral/UpdateAmploGeralController';
          import { DeleteAmploGeralController } from './controllers/AmploGeral/DeleteAmploGeralController';
          import { ListAllAmploGeralController } from './controllers/AmploGeral/ListAllAmploGeralController';
          import { ListAmploGeralByStatusVisitaController } from './controllers/AmploGeral/ListAmploGeralByStatusVisitaController';
          import { ListByInstalacaoAmploGeralController } from './controllers/AmploGeral/ListAmploGeralByInstalacaoController'; 
          import { UpdateProdutividadeDiariaController } from './controllers/ProdutividadeDiaria/UpdateProdutividadeDiariaController';
          import { GetMonthlyProductivityController } from './controllers/ProdutividadeDiaria/GetMonthlyProdutividadeDiariaController';
          import { ListTopProductiveCitiesController } from './controllers/ProdutividadeDiaria/ListTopProdutividadeDiariaController'; 
          import { ListLeastProductiveCitiesController } from './controllers/ProdutividadeDiaria/ListLeastProdutividadeDiariaController';
          import { ListTopAndLeastProductiveCitiesController } from './controllers/ProdutividadeDiaria/ListTopAndLeastProdutividadeDiariaController';
          import { ListByNomeMunicipioAmploGeralController } from './controllers/AmploGeral/ListAmploGeralByMunicipioController';
          import { ListAmploGeralByPeriodoVisitaController } from './controllers/AmploGeral/ListAmploGeralByPeriodoVisitaController';
          import { ListAmploGeralByStatusInfraController } from './controllers/AmploGeral/ListAmploGeralByStatusInfraController';
          import { ListAmploGeralPublicacaoController } from './controllers/AmploGeral/ListAmploGeralPublicacaoController';
          import { CreateProdutividadeDiariaController } from './controllers/ProdutividadeDiaria/CreateProdutividadeDiariaController';
          import { DeleteProdutividadeDiariaController } from './controllers/ProdutividadeDiaria/DeleteProdutividadeDiariaController';
          import { adminDiretoriaMiddleware } from './middlewares/adminDiretoriaMiddleware';
          import { ListAmploGeralByStatusInstalacaoController } from './controllers/AmploGeral/ListAmploGeralByStatusInstalacaoController';
          import { ListAmploGeralByStatusPublicacaoController } from './controllers/AmploGeral/ListAmploGeralByStatusPublicacaoController';
          import { ListAmploGeralByVisitasController } from './controllers/AmploGeral/ListAmploGeralByVisitasController';
          import { ListAmploGeralByDataInstalacaoController } from './controllers/AmploGeral/ListAmploGeralByDataInstalacaoController';
          import { ListAmploGeralByVisitedCitiesController } from './controllers/AmploGeral/ListAmploGeralByVisitedCitiesController';
          import { ListAmploGeralByStatusVisitaBreakdownController } from './controllers/AmploGeral/ListAmploGeralByStatusVisitaBreakdownController';
          import { ListAmploGeralByStatusPublicacaoBreakdownController } from './controllers/AmploGeral/ListAmploGeralByStatusPublicacaoBreakdownController';
          import { ListAmploGeralByStatusInstalacaoBreakdownController } from './controllers/AmploGeral/ListAmploGeralByStatusInstalacaoBreakdownController';
          import { ListProdutividadeByCidadeController } from './controllers/ProdutividadeDiaria/ListProdutividadeByCidadeController';
          import { ListProdutividadeGeralMensalController } from './controllers/ProdutividadeDiaria/ListProdutividadeGeralMensalController';

          const router = Router();
          const prisma = new PrismaClient();

          // --- Rotas de Usuários ---
          router.post('/users/register', new CreateUserController().handle);
          router.post('/users/login', new AuthUserController().handle);
          router.put('/users/:id', authMiddleware, new UpdateUserController().handle);
          router.put('/users/:id/password', authMiddleware, new UpdatePasswordController().handle);
          router.post('/users/reset-password/request', new RequestResetPasswordController().handle);
          router.post('/users/reset-password/confirm', new ConfirmResetPasswordController().handle);

          // --- Rotas de cin amplo geral ---
          router.post('/amplo-geral', authMiddleware, adminDiretoriaMiddleware, new CreateAmploGeralController().handle);
          router.put('/amplo-geral/:id', authMiddleware, adminDiretoriaMiddleware, new UpdateAmploGeralController().handle);
          router.delete('/amplo-geral/:id', authMiddleware, adminDiretoriaMiddleware, new DeleteAmploGeralController().handle);
          router.get('/amplo-geral', new ListAllAmploGeralController().handle);
          router.get('/amplo-geral/nome-municipio', new ListByNomeMunicipioAmploGeralController().handle);
          router.get('/amplo-geral/status-visita', new ListAmploGeralByStatusVisitaController().handle);
          router.get('/amplo-geral/periodo-visita', new ListAmploGeralByPeriodoVisitaController().handle);
          router.get('/amplo-geral/status-infra', new ListAmploGeralByStatusInfraController().handle);
          router.get('/amplo-geral/publicacao', new ListAmploGeralPublicacaoController().handle);
          router.get('/amplo-geral/instalacao', new ListByInstalacaoAmploGeralController().handle);
          router.get('/amplo-geral/status-publicacao', new ListAmploGeralByStatusPublicacaoController().handle);
          router.get('/amplo-geral/status-instalacao', new ListAmploGeralByStatusInstalacaoController().handle);
          router.get('/amplo-geral/visitas-proximas', new ListAmploGeralByVisitasController().handle);
          router.get('/amplo-geral/instalacoes-recentes', new ListAmploGeralByDataInstalacaoController().handle);
          router.get('/amplo-geral/visited-cities', new ListAmploGeralByVisitedCitiesController().handle);
          router.get('/amplo-geral/status-visita-breakdown', new ListAmploGeralByStatusVisitaBreakdownController().handle);
          router.get('/amplo-geral/status-publicacao-breakdown', new ListAmploGeralByStatusPublicacaoBreakdownController().handle);
          router.get('/amplo-geral/status-instalacao-breakdown', new ListAmploGeralByStatusInstalacaoBreakdownController().handle);

          // --- Rotas de produtividade diaria cin ---
          router.post('/produtividade-diaria', authMiddleware, adminDiretoriaMiddleware, new CreateProdutividadeDiariaController().handle);
          router.put('/produtividade-diaria/:id', authMiddleware, adminDiretoriaMiddleware, new UpdateProdutividadeDiariaController().handle);
          router.delete('/produtividade-diaria/:id', authMiddleware, adminDiretoriaMiddleware, new DeleteProdutividadeDiariaController().handle);

          router.get('/produtividade/mensal', new GetMonthlyProductivityController().handle);
          router.get('/produtividade/top-cities', new ListTopProductiveCitiesController().handle);
          router.get('/produtividade/least-cities', new ListLeastProductiveCitiesController().handle);
          router.get('/produtividade/top-and-least-cities', new ListTopAndLeastProductiveCitiesController().handle);
          router.get('/produtividade/by-cidade/:nome_municipio', new ListProdutividadeByCidadeController().handle);
          router.get('/produtividade/geral-mensal', new ListProdutividadeGeralMensalController().handle);

          export default router;      
      ```
      - Fluxo: Request → Route → Controller → Service → Model/DB → Response JSON.

    **Exemplo de Fluxo CRUD**:
    - **Create**: POST /api/amplo-geral → Controller.create → Service.create (model.create) → DB insert → JSON response.
    - **Read**: GET /api/amplo-geral → Controller.getAll → Service.getAll (model.findAll com includes) → JSON.
    - **Update**: PUT /api/amplo-geral/:id → Controller.update → Service.update (model.update) → JSON.
    - **Delete**: DELETE /api/amplo-geral/:id → Controller.delete → Service.delete (model.destroy) → 204 No Content.

    Services agregam lógica (ex.: breakdowns calculam % com SQL raw), evitando controllers inchados.
    """)

elif page == "Dashboard Frontend":
    st.title("Dashboard Frontend (dashboard_cin)")
    st.markdown("""
    ## Arquitetura do Frontend

    O frontend é React + Vite com Chakra UI (UI), TanStack Query (dados), Recharts (gráficos) e react-simple-maps (mapas). Estrutura:

    ```
    dashboard_cin/
    ├── public/
    │   └── bahia_municipios.json  # GeoJSON para mapa da Bahia (417 municípios)
    ├── src/
    │   ├── components/
    │   │   ├── BahiaMap.jsx  # Mapa interativo da Bahia (hover, seleção)
    │   │   ├── CityListModal.jsx  # Modal para listas de cidades + export Excel
    │   │   ├── DashboardCard.jsx  # Cartões expansíveis (7 cards: Visitados, etc.)
    │   │   ├── Header.jsx  # Cabeçalho com toggle tema
    │   │   ├── HeatMapSection.jsx  # Novo: Mapa de calor + tabela paginada + carrossel gráficos
    │   │   ├── MainSection.jsx  # Seção principal: Tabs (Listas/Mapa), gráficos Bar/Area
    │   │   ├── PieChartSection.jsx  # Gráficos de pizza (status visitas/publicações/instalações)
    │   │   └── Slideshow.jsx  # Modo slideshow com navegação auto/manual
    │   ├── services/
    │   │   └── api.js  # Axios config + funções (getAmploGeral, getCityDetails, etc.)
    │   ├── App.jsx  # Root: Modos (interativo/slideshow), queries iniciais, lazy loads
    │   ├── main.jsx  # Entrada React (QueryClientProvider, ChakraProvider)
    │   └── index.css  # Estilos globais
    ├── package.json  # Dependências: react, @chakra-ui/react, @tanstack/react-query, recharts, react-simple-maps
    ├── vite.config.js  # Proxy para API (/api → localhost:3000)
    └── README.md  # Setup (npm install, npm run dev)
    ```

    **Fluxo Geral**:
    - `App.jsx`: Gerencia modo (null → escolha; 'interativa' → Header + Cartões + MainSection + PieChartSection + HeatMapSection; 'slideshow' → Slideshow).
    - Queries TanStack: Fetch paralelo em App (cardData), componentes usam `useQuery` para dados específicos (ex.: MainSection fetch AmploGeral + TopCities).
    - **Modo Interativo**: Grid de 7 cartões (porcentagens/status), seções com gráficos/mapas, modals para detalhes/export.
    - **Modo Slideshow**: Lazy-loaded, slides com BarChart, LineChart, PieChart, BahiaMap.
    - Integração API: `services/api.js` usa Axios com proxy; ex.: `getAmploGeral()` chama `/amplo-geral`.

    Exemplo de Código em `App.jsx` (Modo Interativo):
    ```jsx
    // Lazy loads
    const PieChartSection = lazy(() => import('./components/PieChartSection'));
    const HeatMapSection = lazy(() => import('./components/HeatMapSection'));

    // Query para cartões
    const { data: cardData } = useQuery({
      queryKey: ['cardData'],
      queryFn: async () => {
        const [amploRes, ...] = await Promise.all([getAmploGeral(), ...]);
        return { '343 Cidades': { cities: amploRes.data }, ... };
      },
    });

    return (
      <Box bg={bgMain}>
        <Header />
        <Grid templateColumns="repeat(7, 1fr)" gap={4}>
          {Object.keys(cardData).map(title => (
            <DashboardCard key={title} title={title} cities={cardData[title].cities} />
          ))}
        </Grid>
        <Suspense fallback={<LoadingSpinner />}>
          <MainSection />
          <PieChartSection />
          <HeatMapSection />  // Novo componente
        </Suspense>
      </Box>
    );
    ```

    **Features Chave**:
    - **Mapas**: `BahiaMap.jsx` (interativo em MainSection), `HeatMapSection.jsx` (calor por status, expande para tabela + carrossel gráficos).
    - **Gráficos**: Pie (breakdowns), Bar/Area (produção), carrossel em HeatMap (cidade vs. top/least).
    - **Modals**: `CityListModal.jsx` (listas + export Excel), modals inline em HeatMap (detalhes + tabela produtividades).
    - **Export**: PNG (html2canvas), CSV (tabelas), Excel (xlsx em modals).
    - **Responsividade**: Chakra Grids/Tabs, useWindowSize para charts.
    """)

elif page == "Dependências":
    st.title("Dependências")
    st.markdown("""
    ## Dependências da API e Dashboard

    ### API (api_cin) - package.json
    Dependências principais:
    - `express`: Framework web (rotas, middleware).
    - `sequelize`: ORM para PostgreSQL (models, migrations).
    - `pg`: Driver PostgreSQL.
    - `cors`: Middleware para CORS (frontend acessa API).
    - `dotenv`: Carrega .env.
    - `bcryptjs`: Hash senhas (se JWT usado).
    - `jsonwebtoken`: Autenticação JWT.
    - `nodemon`: Dev server (npm run dev).

    Dev Dependencies: `sequelize-cli` (migrações).

    ### Dashboard (dashboard_cin) - package.json
    Dependências principais:
    - `react`, `react-dom`: Core React.
    - `@chakra-ui/react`, `@emotion/react`: UI components/tema.
    - `@tanstack/react-query`: Gerenciamento de dados/queries.
    - `recharts`: Gráficos (Pie, Bar, Area).
    - `react-simple-maps`: Mapas (ComposableMap para Bahia).
    - `html2canvas`: Download gráficos PNG.
    - `xlsx`: Export Excel.
    - `framer-motion`: Animações (modals, cards).
    - `axios`: HTTP client (services/api.js).
    - `@react-hook/window-size`: Responsividade charts.

    Dev Dependencies: `vite`, `@vitejs/plugin-react` (build).

    **Instalação**:
    - API: `cd api_cin && npm install`
    - Dashboard: `cd dashboard_cin && npm install`
    """)

elif page == "Integração API-Dashboard":
    st.title("Integração API-Dashboard")
    st.markdown("""
    ## Como a Dashboard Consome a API

    A dashboard usa `services/api.js` (Axios) para chamadas, com proxy em Vite (`/api` → `localhost:3000/api`).

    Exemplo em `api.js`:
    ```js
    import axios from 'axios';
    const api = axios.create({ baseURL: '/api' });  // Proxy ativo

    export const getAmploGeral = () => api.get('amplo-geral');
    export const getCityDetails = (nome_municipio) => api.get(`amplo-geral/nome-municipio?nome_municipio=${nome_municipio}`);
    export const getTopAndLeastCities = ({ ano, limit }) => api.get(`produtividade/top-and-least-cities?ano=${ano}&limit=${limit}`);
    ```

    **Fluxo de Integração**:
    1. **App.jsx**: Query inicial para cartões (Promise.all com getVisitedCities, getAmploGeral, etc.).
    2. **MainSection.jsx**: `useQuery` para AmploGeral (visitas/instalações), TopCities (gráfico Bar), GeralMensal (gráfico Area).
    3. **PieChartSection.jsx**: Queries para breakdowns (status-visita-breakdown, etc.) — cliques em pie mostram listas.
    4. **HeatMapSection.jsx**: getAmploGeral (mapa calor + tabela), getCityDetails (modals/detalhes), getTopAndLeastCities (carrossel gráfico 2).
    5. **BahiaMap.jsx**: Integra com selectedCity de MainSection/HeatMap para highlights.

    **Tratamento de Erros**: TanStack Query usa `error` state (ex.: fallback <Text>{error.message}</Text>).
    **Cache**: Queries cache por 5min (staleTime), refetch em foco/mount.
    **Export**: Frontend exporta dados da API (CSV/PNG/Excel).

    **Teste de Integração**:
    - Rode API (`npm run dev` em api_cin).
    - Rode Dashboard (`npm run dev` em dashboard_cin).
    - Verifique Network tab (F12): Chamadas como `/api/amplo-geral` devem retornar 200 + JSON.
    """)