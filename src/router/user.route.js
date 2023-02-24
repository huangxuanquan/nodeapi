const Router = require('koa-router')

//引入controller
const { register,login } = require('../controller/user.controller') 

const router = new Router({ prefix: '/users' })

router.post('/register',register)
router.post('/login',login)

module.exports = router