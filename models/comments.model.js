const db = require('../db/connection')

exports.selectCommentsByArtId = (artId) => {
    return db.query(`SELECT * FROM comments WHERE article_id = ${artId} ORDER BY created_at DESC`)
        .then((response) => {
            return response.rows
        })
}