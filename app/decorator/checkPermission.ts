/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 16:44:24
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 16:46:01
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/decorator/checkPermission.ts
 */
import { GlobalErrorTypes } from '../error'
import { Controller } from 'egg'
export default function checkPermission(modelName: string, errnoType: GlobalErrorTypes, userKey = 'user') {
    return function (prototype, key: string, descriptor: PropertyDescriptor) {
        console.log(`prototype:${prototype},key:${key}`);
        const originalMethod = descriptor.value
        descriptor.value = async function (...args: any[]) {
            const that = this as Controller
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { ctx, app } = that
            const { id } = ctx.params
            const userId = ctx.state.user._id
            const certianRecord = await app.model[modelName].findOne({ id })
            if (!certianRecord || certianRecord[userKey].toString() !== userId) {
                return ctx.helper.error({ ctx, errnoType })
            }
            await originalMethod.apply(this, args)
        }
    }
}