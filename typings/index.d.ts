/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 10:59:27
 * @Deprecated: 否
 * @FilePath: /code-robot-server/typings/index.d.ts
 */
import 'egg';
import { Connection, Model } from 'mongoose'
import { type } from "os";
import { UserProps } from "../app/model/user";

declare module 'egg' {
    interface MongooseModels extends IModel {
        [key: string]: Model<any>;
    }
    //扩展到app上面
    interface Application {
        mongoose: Connection;
        model: MongooseModels;
        sessionMap: {
            [key: string]: any;
        },
        sessionStore: any;
    }
    //扩展加密解密到ctx上面
    interface Context {
        genHash(plainText: string): Promise<string>;
        compare(plainText: string, hash: string): Promise<boolean>;
    }
    //扩展加密需要多少轮
    interface EggAppConfig {
        bcrypt: {
            saltRounds: number;
        }
    }
}