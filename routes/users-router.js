const { getUsers } = require('../controllers/users.controller');
const userRouter = require('express').Router();

// userRouter.get('/', (req, res) => {
//   res.status(200).send('All OK from /api/users');
// });

userRouter.get('/', getUsers)

module.exports = userRouter;


