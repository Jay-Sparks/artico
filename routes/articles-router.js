const { getArticles, getArticleById, addVoteById, addArticle } = require('../controllers/articles.controller');
const { getCommentsByArtId, addCommentByArtId } = require('../controllers/comments.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles)

articlesRouter.post('/', addArticle)

articlesRouter.get('/:article_id', getArticleById)

articlesRouter.patch('/:article_id', addVoteById)

articlesRouter.get('/:article_id/comments', getCommentsByArtId)

articlesRouter.post('/:article_id/comments', addCommentByArtId)

module.exports = articlesRouter


