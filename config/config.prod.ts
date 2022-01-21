/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-21 10:24:14
 * @Deprecated: 否
 * @FilePath: /code-robot-server/config/config.prod.ts
 */
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  //给mongodb和redis添加密码
  config.mongoose = {
    url: 'mongodb://code-robot-mongo:27017/robot',
    options: {
      user: process.env.MONGO_DB_USERNAME,
      password: process.env.MONGO_DB_PASSWORD
    }
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'code-robot-redis',
      password: '',
    }
  }

  //配置cors允许的请求
  // config.security = {
  //   domainWhiteList:[]
  // }

  //设置过期时间
  config.jwtExpires = '2 days'

  //本地的URL替换
  config.giteeOauthConfig = {
    redirectURL: 'http://api.code-robot.co/api/users/passport/gitee/callback'
  }
  config.H5BaseURL = 'http://h5.code-robot.co'

  return config;
};
