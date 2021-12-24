/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 16:54:48
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-23 16:12:09
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/extend/application.ts
 */

import axios, { AxiosInstance } from 'axios';
import { Application } from 'egg';
import Dysmsapi from '@alicloud/dysmsapi20170525';
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import * as $OpenApi from '@alicloud/openapi-client';

const AXIOS = Symbol('Application#axios');
const ALCLIENT = Symbol('Application#ALCLIENT');

export default {
    echo(msg: string) {
        const that = this as Application;
        return `hello${msg}${that.config.name}`;
    },
    get axiosInstance(): AxiosInstance {
        if (!this[AXIOS]) {
            this[AXIOS] = axios.create({
                baseURL: 'https://dog.ceo/',
                timeout: 5000,
            });
        }
        return this[AXIOS];
    },
    get ALClient(): Dysmsapi {
        const that = this as Application
        console.log(that.config.aliCloudConfig)
        const { accessKeyId, accessKeySecret, endpoint } = that.config.aliCloudConfig
        if (!this[ALCLIENT]) {
            const config = new $OpenApi.Config({
                accessKeyId,
                accessKeySecret
            })
            config.endpoint = endpoint
            this[ALCLIENT] = new Dysmsapi(config)
        }
        return this[ALCLIENT]
    }
};
