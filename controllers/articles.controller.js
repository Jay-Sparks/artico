const { 
    fetchArticles, 
    selectArticleById, 
    incrementVote, 
    fetchArticlesByTopic,
    fetchSortedArticles,
    insertArticle
} = require('../models/articles.model')

const { selectCommentsByArtId } = require('../models/comments.model')

exports.getArticles = ( req, res, next ) => {
    const { topic, sort_by, order } = req.query
    const promises = [fetchArticles()]
    if(topic) {
        promises.push(fetchArticlesByTopic(topic))
    }
    if(sort_by) {
        promises.push(fetchArticles(sort_by, order))
    }

    Promise.all(promises).then((promiseResolutions) => {
        if(promiseResolutions.length >= 2) {
            res.status(200).send({ articles: promiseResolutions[1] })
        } else if (promiseResolutions.length = 1){
            res.status(200).send({ articles: promiseResolutions[0]})
        }
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId)
        .then((article) => {
            return selectCommentsByArtId(articleId)
                .then((comments) => {
                    article[0].comment_count = comments.length
                    res.status(200).send({ article: article[0] })
                })
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

exports.addArticle = (req, res, next) => {
    const article = req.body
    insertArticle(article)
        .then((newArticle) => {
            res.status(201).send({ article: newArticle[0] })
        })
        .catch((err) => {
            next(err)
        })
}
