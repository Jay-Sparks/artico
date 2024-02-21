const { 
    fetchArticles, 
    selectArticleById, 
    incrementVote, 
    fetchArticlesByTopic 
} = require('../models/articles.model')

exports.getArticles = ( req, res, next ) => {
    const { topic } = req.query
    const promises = [fetchArticles()]

    if(topic) {
        promises.push(fetchArticlesByTopic(topic))
    }

    Promise.all(promises).then((promiseResolutions) => {
        if(promiseResolutions.length > 1) {
            res.status(200).send({ articles: promiseResolutions[1] })
        } else if (promiseResolutions.length <= 1){
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
