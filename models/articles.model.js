const db = require('../db/connection')


exports.fetchArticles = (sort_by="created_at", order="DESC") => {
    const validSortBys = ["created_at", "author", "author_id", "title", "topic", "votes"]
    const validOrders = ["asc", "desc", "ASC", "DESC"]
    if(!validSortBys.includes(sort_by)){
        return Promise.reject({status:400, msg: "Bad Request"})
    }
    if(!validOrders.includes(order)){
        return Promise.reject({status:400, msg: "Bad Request"})
    }
    let sqlString = `SELECT * FROM articles`
    sqlString += ` ORDER BY ${sort_by} ${order}`
    return db.query(sqlString)
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

exports.incrementVote = (inc_votes, article_id) => {
    const voteNum = Number(inc_votes)
    const idNum = Number(article_id)
    if(isNaN(idNum)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    } else {
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *`, [voteNum, idNum])
            .then(({rows}) => {
                if(rows.length === 0) {
                    return Promise.reject({status: 404, msg: "Not Found"})
                } else {
                    return rows
                }
            })
    }
}

exports.fetchArticlesByTopic = (topic) => {
    if(!isNaN(topic)) {
        return Promise.reject({status:400, msg: "Bad Request"})
    }
    return db.query(`SELECT * FROM articles WHERE topic=$1`, [topic])
        .then((articleResponse) => {
            const articles = articleResponse.rows
            if(articles.length === 0) {
                return db.query(`SELECT * FROM topics WHERE slug=$1`, [topic])
                    .then((topicsResponse) => {
                        const topic = topicsResponse.rows
                        if(topic.length === 0) {
                            return Promise.reject({status: 404, msg: "Not Found"})
                        } else {
                            return []
                        }
                    })
            } else if (articles.length >= 1){
                return articles
            }
        })
}

exports.insertArticle = (article) => {
    const { title, topic, author, body,  article_img_url } = article
    if(title.length === 0 || body.length === 0) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    return db.query(`SELECT * from topics WHERE slug=$1`, [topic])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({status: 404, msg: "Not Found"})
            }
            return db.query(`SELECT * from users WHERE username=$1`, [author])
                .then(({rows}) => {
                    if(rows.length === 0) {
                        return Promise.reject({status: 404, msg: "Not Found"})
                    }
                    return db.query(
                        `INSERT INTO articles 
                        ( title, topic, author, body, article_img_url) 
                        VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
                        [ title, topic, author, body,  article_img_url ]
                        )
                        .then(({rows}) => {
                            return rows
                        })
                    })
                })
}

exports.fetchPaginatedArticles = (limit=10, p) => {
    return db.query(`SELECT * FROM articles`)
        .then(({rows}) => {
            // console.log(rows, "MODEL");
            const total_count = rows.length
            const articleArr = rows.map(({ body, ...article }) => {
                const articleCopy = {...article}
                articleCopy.total_count = total_count
                return articleCopy
            })
            const totalPages = Math.ceil(total_count / JSON.parse(limit))
            let requestedPage
            if(!p){
                requestedPage = 1
            } else if(p && isNaN(p)) {
                return Promise.reject({status:400, msg: "Bad Request"})
            } else if(JSON.parse(p) > totalPages) {
                return Promise.reject({status:404, msg: "Not Found"})
            } else {
                requestedPage = JSON.parse(p)
            }
            const skip = (requestedPage - 1) * limit
            return articleArr.slice(skip, JSON.parse(limit) + skip)
        })
}