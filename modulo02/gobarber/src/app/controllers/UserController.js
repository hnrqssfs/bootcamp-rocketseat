import * as Yup from 'yup';

import User from '../models/User';

class UserController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string()
                    .required()
                    .min(6),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({
                    error: 'Validation failed',
                });
            }

            const userExist = await User.findOne({
                where: { email: req.body.email },
            });

            if (userExist) {
                return res.status(400).json({
                    error: 'User already exist',
                });
            }

            const { id, name, email, provider } = await User.create(req.body);

            return res.json({
                id,
                name,
                email,
                provider,
            });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                email: Yup.string(),
                oldPassword: Yup.string().min(6),
                password: Yup.string()
                    .min(6)
                    .when('oldPassword', (oldPassword, field) =>
                        oldPassword ? field.required() : field
                    ),
                confirmPassword: Yup.string().when(
                    'password',
                    (password, field) =>
                        password
                            ? field.required().oneOf([Yup.ref('password')])
                            : field
                ),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({
                    error: 'Validation failed',
                });
            }

            const { email, oldPassword } = req.body;

            if (req.userId !== parseInt(req.params.id_user, 10)) {
                return res.status(401).json({
                    error: 'User does not update another user',
                });
            }

            const user = await User.findOne({
                where: {
                    id: req.userId,
                },
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                });
            }

            if (email !== user.email) {
                const userExist = await User.findOne({ where: { email } });

                if (userExist) {
                    return res.status(401).json({
                        error: 'User already exists',
                    });
                }
            }

            if (oldPassword && !(await user.checkPassword(oldPassword))) {
                return res.status(401).json({
                    error: 'User passowrd does not match',
                });
            }

            const { id, name, provider } = await user.update(req.body);

            return res.json({
                id,
                name,
                email,
                provider,
            });
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

export default new UserController();
