/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 16:49:21
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-09 17:06:58
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/middleware/myLogger.ts
 */

import { EggAppConfig, Application, Context } from 'egg';
import { appendFileSync } from 'fs';

export default (options: EggAppConfig['myLogger'], app: Application) => {
    return async (ctx: Context, next: () => Promise<any>) => {
        console.log('options', options);
        console.log('default options', app.config.logger);
        const startTime = Date.now();
        const requestTime = new Date();
        await next();
        const ms = Date.now() - startTime;
        const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
        console.log(ctx.method);
        if (options.allowedMethod.includes(ctx.method)) {
            appendFileSync('./log.txt', logTime + '\n');
        }
    };
};
