import { Router } from 'express'

const routes = new Router()

routes.get('/', (req, res) => res.json({ result: 'ok' }))

export default routes
