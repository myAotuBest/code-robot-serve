/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 15:01:47
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 15:19:03
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/decorator/inputValidate.ts
 */
import { GlobalErrorTypes } from '../error'
import { Controller } from 'egg'
// 创建工厂函数传入 rules 和 errorType
export default function validateInput(rules: any, errnoType: GlobalErrorTypes) {
    return function (prototype, key: string, descriptor: PropertyDescriptor) {
        console.log(`prototype:${prototype},key:${key}`);

        const originalMethod = descriptor.value
        descriptor.value = async function (...args: any[]) {
            const that = this as Controller
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { ctx, app } = that
            const errors = app.validator.validate(rules, ctx.request.body)
            if (errors) {
                return ctx.helper.error({ ctx, errnoType, error: errors })
            }
            await originalMethod.apply(this, args)
        }
    }
}