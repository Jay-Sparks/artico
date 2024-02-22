const apiRouter = require('express').Router()
const articlesRouter = require('./articles-router')
const topicsRouter = require('./topics-router')
const commentsRouter = require('./comments-router')
const usersRouter = require('./users-router')


apiRouter.use('/users', usersRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter