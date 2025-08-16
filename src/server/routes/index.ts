import { Router } from 'express';
import RepoController from '../controllers/repoController';

const router = Router();
const repoController = new RepoController();

export const setRoutes = () => {
    router.post('/repos', repoController.createRepo.bind(repoController));
    router.get('/repos/:id', repoController.getRepo.bind(repoController));
    
    return router;
};