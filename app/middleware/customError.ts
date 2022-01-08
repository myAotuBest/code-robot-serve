/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-23 11:50:10
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-07 22:15:56
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/middleware/customError.ts
 */
import { Context } from 'egg'
export default () => {
    return async (ctx: Context, next: () => Promise<any>) => {
        try {
            await next()
        } catch (e) {
            const error = e as any
            if (error && error.status === 401) {
                return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })
            } else if (ctx.path === '/api/utils/upload-img') {
                if (error && error.status === 400) {
                    return ctx.helper.error({ ctx, errnoType: 'imageUploadFileFormatError', error: error.message })
                }
                throw error
            }
            throw error
        }
    }
}