const bcrypt = require('bcryptjs');
const { createUser,getUerInfo,updatePwd } = require('../service/user.service')
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
  } = require('../config/config.default')
class UserController {
    async register(ctx,next) {
        const { user_name,password } = ctx.request.body;
        // 2. 操作数据库
        const res = await createUser(user_name,password)
        // 3. 返回结果
        ctx.body = {
            code: 0,
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name,
            },
        }
    }
    async login(ctx,next) {
        const { user_name } = ctx.request.body;
        try {
            // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
            const { password, ...res } = await getUerInfo({ user_name })
            ctx.body = {
              code: 0,
              message: '用户登录成功',
              result: {
                token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
              },
            }
        } catch (err) {
            console.error('用户登录失败', err)
        }
    }
    async updatePassword(ctx,next) {
        const { user_name,password } = ctx.request.body;
        try {
            const salt = bcrypt.genSaltSync(10)
            // hash保存的是 密文
            const hash = bcrypt.hashSync(password, salt)

            const res = await updatePwd(ctx.state.user.id,hash)
            if(res[0] > 0) {
                ctx.body = {
                    code: 0,
                    message: '密码修改成功',
                    result: {},
                }
            }else {
                ctx.body = {
                    code: '10007',
                    message: '修改的用户不存在',
                    result: {},
                }
            }
        } catch (err) {
            console.error('密码修改失败', err)
        }
    }
}
module.exports = new UserController