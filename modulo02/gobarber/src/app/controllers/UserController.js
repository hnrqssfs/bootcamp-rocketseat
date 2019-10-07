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
            if (req.userId !== parseInt(req.params.id_user, 10)) {
                return res.status(401).json({
                    error: 'User does not update another user',
                });
            }

            return res.json({ ok: true });
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

export default new UserController();
