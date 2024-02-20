const db = require('../db/connection')

exports.selectCommentsByArtId = (artId) => {
    return db.query(`SELECT * FROM comments WHERE article_id = ${artId} ORDER BY created_at DESC`)
        .then((response) => {
            return response.rows
        })
}

exports.insertComment = (body, articleId, author, votes = 0) => {
    return db.query(`SELECT * from users WHERE username=$1`, [author])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: "Not Found"})
            }
            return db.query(
                `INSERT INTO comments 
                (body, article_id, author, votes) 
                VALUES ($1, $2, $3, $4) RETURNING *;`,
                [body, articleId, author, votes]
            )
            .then((response) => {
                return response
            })
    })
}