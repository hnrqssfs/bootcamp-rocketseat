import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
    try {
        const user = await User.create({
            name: 'Henrique',
            email: 'hnrq.assuncao@gmail.com',
            provider: false,
            password_hash: '123',
        });
        return res.json(user);
    } catch (error) {
        return res.status(400).res.json(error);
    }
});

export default routes;
