const { selectCommentsByArtId, insertComment } = require('../models/comments.model')

exports.getCommentsByArtId = ( req, res, next ) => {
    const articleId = req.params.article_id
    selectCommentsByArtId(articleId)
        .then((comments) => {
            comments.length === 0 ?
                res.status(404).send({ msg: "No comments found" })   
                :
                res.status(200).send({ comments: comments })
        })
        .catch((err) => {
            next(err)
        })
}

exports.addCommentByArtId = ( req, res, next ) => {
    const articleId = req.params.article_id
    const author = req.body.username
    const body = req.body.body
    return insertComment(body, articleId, author)
        .then((comment) => {
            res.status(201).send({ comment: comment.rows[0] })
        })
        .catch((err) => {
            next(err)
        })
}