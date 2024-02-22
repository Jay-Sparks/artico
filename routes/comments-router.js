const { removeComment, updateCommentVote } = require('../controllers/comments.controller')

const commentsRouter = require('express').Router()

commentsRouter.patch('/:comment_id', updateCommentVote)

commentsRouter.delete('/:comment_id', removeComment)

module.exports = commentsRouter