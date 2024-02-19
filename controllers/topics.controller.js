const db = require('../db/connection')
const { selectTopics } = require('../models/topics.model')

exports.getTopics = ( req, res, next) => {
    const path = req.path
    path !== '/api/topics' ?
        res.status(404)
        :
        selectTopics()
            .then((topics) => {
                res.status(200).send({ topics: topics })
            })
            .catch((err) => {
                next(err)
            })
}