const express = require('express')

const app = express()

const projects = []

app.use(express.json())

app.post('/projects')

app.listen(3000, () => console.log('app is running'))