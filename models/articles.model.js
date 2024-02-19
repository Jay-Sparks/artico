const db = require('../db/connection')

exports.selectArticles = () => {
    return db.query('SELECT * from articles ORDER BY created_at DESC')
        .then((articles) => {
            const articleArr = articles.rows.map(({ body, ...article }) => {
                return article
            })
            return articleArr
        })
}

exports.selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${articleId}`)
        .then((article) => {
            return article.rows
        })
}