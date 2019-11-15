const { Router } = require('express')

const routes = new Router()

routes.get('/', (req, res) => res.json({ result: 'ok' }))

module.exports = routes
