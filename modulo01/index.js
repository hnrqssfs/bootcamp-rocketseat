const express = require('express')

const app = express()

app.use(express.json())

app.get('/', function(req, res) {
    const { name } = req.query

    return res.json({ message: `Helo ${name}` })
})

const users = [ 'lucas', 'jm', 'henrique' ]

function checkUserExist(req, res, next) {
    if(!req.body.name)
        return res.status(404).json({
            error: 'name is required'
        })

    return next()    
}

function checkUserValid(req, res, next) {
    const { index } = req.params
    const user = users[index]

    console.log(user)
    if(!user)
        return res.status(404).json({
            error: 'User not exist'
        })

    req.user = user    

    return next()    
}

app.use((req,res, next) => {
    console.time('Request')
    
    console.log({
        method: req.method,
        uri: req.url
    })
    next()

    console.timeEnd('Request')
})

app.get('/users/:id', function(req, res) {
    const { id } = req.params

    return res.json({ message: `Buscando usuário ${id}` })
})

app.get('/users/list/:index', checkUserValid, function(req, res) {
    const { user } = req
    const { index } = req.params

    return res.json({ message: `Buscando usuário ${index} do array ${user}` })
})

app.post('/users', checkUserExist, function(req, res) {
    const { name } = req.body
    users.push(name)


    return res.json({ users })
})

app.put('/users/:id', checkUserExist, function(req, res) {
    const { name } = req.body
    const { id } = req.params
    users[id] = name

    return res.json({ users })
})

app.delete('/users/:index', checkUserValid, function(req, res) {
    const { index } = req.params

    users.splice(index, 1)

    return res.send()
})

app.listen(3000, function() {
    console.log('App is running')
})