/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 14:58:03
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-09 15:22:32
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/error/work.ts
 */
export const workErrorMessages = {
    workValidateFail: {
        errno: 102001,
        message: '输入信息验证失败',
    },
    workNoPermissonFail: {
        errno: 102002,
        message: '没有权限完成操作',
    },
    workNoPublicFail: {
        errno: 102003,
        message: '该作品未公开，不能进行操作',
    },
    channelValidateFail: {
        errno: 102004,
        message: '频繁输入信息验证失败',
    },
    channelOperateFail: {
        errno: 102005,
        message: '频繁操作失败',
    }
}