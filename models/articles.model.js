const db = require('../db/connection')

exports.selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${articleId}`)
        .then((article) => {
            return article.rows
        })
}