const { selectArticles, selectArticleById, incrementVote } = require('../models/articles.model')

exports.getArticles = ( req, res, next ) => {
    selectArticles()
        .then((articles) => {
            res.status(200).send({ articles: articles })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId)
        .then((article) => {
            res.status(200).send({ article: article[0] })
        })
        .catch((err) => {
            next(err)
        })
}

exports.addVoteById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    incrementVote(inc_votes, article_id)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle[0] })
        })
        .catch((err) => {
            next(err)
        })
}