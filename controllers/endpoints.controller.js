const db = require('../db/connection')
const { selectEndpoints } = require('../models/endpoints.model')

exports.getEndpoints = ( req, res, next) => {
    const path = req.path
    path !== '/api' ?
        res.status(404)
        :
        res.status(200).send({ endpoints: selectEndpoints() })
}