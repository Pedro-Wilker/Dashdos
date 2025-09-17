import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { adminDiretoriaMiddleware } from '../middlewares/adminDiretoriaMiddleware';
import { CreateProdutividadeDiariaController } from '../controllers/ProdutividadeDiaria/CreateProdutividadeDiariaController';
import { UpdateProdutividadeDiariaController } from '../controllers/ProdutividadeDiaria/UpdateProdutividadeDiariaController';
import { DeleteProdutividadeDiariaController } from '../controllers/ProdutividadeDiaria/DeleteProdutividadeDiariaController';
import { GetMonthlyProductivityController } from '../controllers/ProdutividadeDiaria/GetMonthlyProdutividadeDiariaController';
import { ListTopProductiveCitiesController } from '../controllers/ProdutividadeDiaria/ListTopProdutividadeDiariaController';
import { ListLeastProductiveCitiesController } from '../controllers/ProdutividadeDiaria/ListLeastProdutividadeDiariaController';
import { ListTopAndLeastProductiveCitiesController } from '../controllers/ProdutividadeDiaria/ListTopAndLeastProdutividadeDiariaController';
import { ListProdutividadeByCidadeController } from '../controllers/ProdutividadeDiaria/ListProdutividadeByCidadeController';
import { ListProdutividadeGeralMensalController } from '../controllers/ProdutividadeDiaria/ListProdutividadeGeralMensalController';

const router = Router();

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