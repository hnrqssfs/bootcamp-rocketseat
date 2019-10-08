import User from '../models/User';

class UserController {
    async store(req, res) {
        try {
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
            const { email, oldPassword, password } = req.body;

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

            if (
                password !== undefined &&
                (oldPassword === undefined || oldPassword === null)
            ) {
                return res.status(401).json({
                    error: 'User oldpassword does not match',
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
