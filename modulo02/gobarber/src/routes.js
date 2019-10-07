import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import isAuthenticatedMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(isAuthenticatedMiddleware);

routes.put('/users/:id_user', UserController.update);

export default routes;
