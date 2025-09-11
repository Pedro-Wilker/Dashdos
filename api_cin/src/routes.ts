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