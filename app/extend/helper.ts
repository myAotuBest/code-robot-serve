/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 16:15:03
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 15:01:09
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/extend/helper.ts
 */
import { Context } from 'egg';
import { GlobalErrorTypes, globalErrorMessages } from '../error'


interface ResType {
    ctx: Context;
    res?: any;
    msg?: string;
}

interface ErrorResType {
    ctx: Context;
    errnoType: GlobalErrorTypes;
    error?: any;
}


export default {
    success({ ctx, res, msg }: ResType) {
        ctx.body = {
            errno: 0,
            data: res ? res : null,
            message: msg ? msg : '请求成功',
        };
        ctx.status = 200;
    },
    error({ ctx, errnoType, error }: ErrorResType) {
        const { message, errno } = globalErrorMessages[errnoType];
        ctx.body = {
            errno,
            message,
            ...(error && { error })//...展开符里面判断error存在就把error加进对象里面
        };
        ctx.status = 200;
    }
};
