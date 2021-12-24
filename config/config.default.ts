/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 16:51:08
 * @Deprecated: 否
 * @FilePath: /code-robot-server/config/config.default.ts
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dotenv from 'dotenv';
dotenv.config();
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639037279099_6087';

  // add your egg config in here
  config.middleware = ['myLogger', 'customError'];
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.view = {
    defaultViewEngine: 'nunjucks'
  }
  config.logger = {
    consoleLevel: 'DEBUG',
  };
  config.mongoose = {
    url: 'mongodb://localhost:27017/robot',
  };
  config.bcrypt = {
    saltRounds: 10
  }
  config.sessions = {
    encrypt: false,
  }
  config.jwt = {
    secret: '1234567890'
  }
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    }
  }
  config.cors = {
    origin: 'http://localhost:8080',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH'
  }
  const aliCloudConfig = {
    accessKeyId: process.env.ALC_ACCESS_KEY,
    accessKeySecret: process.env.ALC_SECRET_KEY,
    endpoint: 'dysmsapi.aliyuncs.com'
  }
  // gitee oauth config
  const giteeOauthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://localhost:7001/api/users/passport/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
    giteeUserAPI: 'https://gitee.com/api/v5/user'
  }
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: ['POST'],
    },
    baseUrl: 'default.url',
    aliCloudConfig,
    giteeOauthConfig,
    H5BaseURL: 'http://localhost:7001/api/pages'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};