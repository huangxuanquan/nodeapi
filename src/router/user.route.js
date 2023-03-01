const Router = require('koa-router')
const { userValidator,verifyUser,crpytPassword,verifyLogin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/login.middleware')

//引入controller
const { register,login,updatePassword } = require('../controller/user.controller') 

const router = new Router({ prefix: '/users' })

router.post('/register',userValidator,verifyUser,crpytPassword,register)
router.post('/login',userValidator,verifyLogin,login)
router.patch('/updatePassword', auth, updatePassword)

module.exports = router