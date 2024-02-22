const { removeComment } = require('../controllers/comments.controller');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', removeComment)

module.exports = commentsRouter