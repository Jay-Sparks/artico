const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * from topics')
        .then((results) => {
            return results.rows
        })
}