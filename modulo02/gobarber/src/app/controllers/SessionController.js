import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

const { secret, expiresIn } = authConfig;

class SessionController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().required(),
                password: Yup.string().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({
                    error: 'User and password are required',
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                where: {
                    email,
                },
            });

            if (!user) {
                return res.status(401).json({
                    error: 'User not found',
                });
            }

            if (!(await user.checkPassword(password))) {
                return res.status(401).json({
                    error: 'Password does not match',
                });
            }

            const { id, name } = user;

            return res.json({
                user: {
                    id,
                    name,
                    email,
                },
                token: jwt.sign({ id }, secret, {
                    expiresIn,
                }),
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

export default new SessionController();
