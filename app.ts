/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 17:16:15
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 10:59:46
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app.ts
 */
import { IBoot, Application } from 'egg';
import { createConnection } from 'mongoose';
import { join } from 'path';
// import * as assert from 'assert';
export default class AppBoot implements IBoot {
    private readonly app: Application;
    constructor(app: Application) {
        this.app = app;
        //session存储到内存中
        app.sessionMap = {};
        app.sessionStore = {
            async get(key) {
                app.logger.info('key', key);
                return app.sessionMap[key];
            },
            async set(key, value) {
                app.logger.info('key', key);
                app.logger.info('value', value);
                app.sessionMap[key] = value;
            },
            async destroy(key) {
                delete app.sessionMap[key];
            },
        };
        const { url } = this.app.config.mongoose;
        // assert(url, '[egg-mongoose] url is required on config');
        const db = createConnection(url);
        db.on('connected', () => {
            app.logger.info(`[egg-mongoose] ${url} connected successfully`);
        });
        app.mongoose = db;
    }
    configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        console.log('config', this.app.config.baseUrl);
        console.log('enable middleware', this.app.config.coreMiddleware);


        // this.app.config.coreMiddleware.unshift('myLogger');
    }
    async willReady() {
        // console.log('enable willready', this.app.config.coreMiddleware);
        const dir = join(this.app.config.baseDir, 'app/model');
        this.app.loader.loadToApp(dir, 'model', {
            caseStyle: 'upper',
        });
        // app/model/user.ts => app.model.User
    }
    async didReady() {
        console.log('middleware', this.app.middleware);
        const ctx = await this.app.createAnonymousContext();
        const res = await ctx.service.test.sayHi('roy');
        console.log('did  ready  res', res);
    }
}

