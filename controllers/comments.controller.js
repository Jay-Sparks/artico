const { selectCommentsByArtId } = require('../models/comments.model')

exports.getCommentsByArtId = ( req, res, next) => {
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