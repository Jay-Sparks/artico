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
    const numberTest = Number(articleId)
    if(isNaN(numberTest)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    } else {
        return db.query(`SELECT * FROM articles WHERE article_id=$1`, [articleId])
            .then(({rows}) => {
                if(rows.length === 0) {
                    return Promise.reject({status: 404, msg: "Not Found"})
                } else {
                    return rows
                }
            })
    }
}