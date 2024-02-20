const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticleById, getArticles, addVoteById } = require('./controllers/articles.controller')
const { getCommentsByArtId, addCommentByArtId } = require('./controllers/comments.controller')

const app = express()

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.patch('/api/articles/:article_id', addVoteById)

app.get('/api/articles/:article_id/comments', getCommentsByArtId)

app.post('/api/articles/:article_id/comments', addCommentByArtId)

app.use(( err, req, res, next ) => {
    if(!err.msg && err.code === "42703") {
        res.status(400).send({msg:"Bad Request"})
    }
    else if (!err.msg && err.code === "22P02") {
        res.status(400).send({msg:"Bad Request"})
    }
    else if (!err.msg && err.code === "23502") {
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