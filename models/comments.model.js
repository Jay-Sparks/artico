const db = require('../db/connection')

exports.selectCommentsByArtId = (artId) => {
    return db.query(`SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC`, [artId])
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

exports.deleteComment = (comment_id) => {
    const commentNum = Number(comment_id)
    if(isNaN(commentNum)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    } else {
        return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [commentNum])
            .then(({rows}) => {
                if(rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Not Found"})
                }
                else {
                    return { status: 204 }
                }
            })
    }
}

exports.incrementCommentVote = (inc_votes, comment_id) => {
    const voteNum = Number(inc_votes)
    const idNum = Number(comment_id)
    if(isNaN(idNum)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    } else {
        return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id=$2 RETURNING *`, [voteNum, idNum])
            .then(({rows}) => {
                if(rows.length === 0) {
                    return Promise.reject({status: 404, msg: "Not Found"})
                } else {
                    return rows
                }
            })
    }
}