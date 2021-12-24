/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 14:57:58
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 14:57:58
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/error/user.ts
 */
//错误状态码
export const userErrorMessages = {
    userValidateFail: {
        errno: 101001,
        message: '输入信息验证失败',
    },
    //创建用户失败，写入数据库，失败
    createUserAleadyExists: {
        errno: 101002,
        message: '该用户已经被注册，请直接登录',
    },
    //用户不存在或者密码错误
    loginCheckFailInfo: {
        errno: 101003,
        message: '该用户不存在或者密码错误',
    },
    //登录失败
    loginValidateFail: {
        errno: 101004,
        message: '登录验证失败',
    },
    //发送短信验证码过于频繁
    sendVeriCodeFrequentFailInfo: {
        errno: 101005,
        message: '请勿频繁获取短信验证码',
    },
    //登录时，验证码不正确
    loginVeriCodeIncorrectFailInfo: {
        errno: 101006,
        message: '验证码错误',
    },
    //验证码发送失败
    sendVeriCodeError: {
        errno: 101007,
        message: '验证码发送失败',
    },
    //gitee授权出差
    giteeOauthError: {
        errno: 101008,
        message: 'gitee 授权出错',
    }
}
