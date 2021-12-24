

/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-23 11:09:45
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-23 11:27:06
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/middleware/jwt.ts
 */
import { Context, EggAppConfig } from 'egg'
import { verify } from 'jsonwebtoken'

function getTokenValue(ctx: Context) {
    const { authorization } = ctx.header;
    if (!ctx.header || !authorization) {
        return false;
    }
    if (typeof authorization === 'string') {
        const parts = authorization.trim().split(' ');
        if (parts.length == 2) {
            const schema = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(schema)) {
                return credentials;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export default (options: EggAppConfig['jwt']) => {
    return async (ctx: Context, next: () => Promise<any>) => {
        //从header中获取token
        const token = getTokenValue(ctx);
        if (!token) {
            return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })
        }
        //判断secret是否存在
        const { secret } = options;
        if (!secret) {
            throw new Error('Secret not provided');
        }
        try {
            const decoded = verify(token, secret);
            ctx.state.user = decoded;
            await next();
        } catch (e) {
            return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })
        }
    }

}