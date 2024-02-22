const express = require('express')
const { getEndpoints } = require('./controllers/endpoints.controller')
const apiRouter = require('./routes/api-router');

const app = express()

app.use(express.json())

app.get('/api', getEndpoints)

app.use('/api', apiRouter)

app.use(( err, req, res, next ) => {
    if(!err.msg && err.code === "42703") {
        res.status(404).send({msg:"Not Found"})
    }
    else if (!err.msg && err.code === "22P02") {
        res.status(400).send({msg:"Bad Request"})
    }
    else if (!err.msg && err.code === "23502") {
        res.status(400).send({msg:"Bad Request"})
    }
    else if (!err.msg && err.code === "23503") {
        res.status(400).send({msg:"Bad Request"})
    }
    else if(err) {
        res.status(err.status).send(err)
    } 
    else {
        res.status(500).send({msg: "Server Error!"})
    }
})

module.exports = { app }