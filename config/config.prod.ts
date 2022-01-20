/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-20 14:34:41
 * @Deprecated: 否
 * @FilePath: /code-robot-server/config/config.prod.ts
 */
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  //给mongodb和redis添加密码
  // config.mongoose = {
  //   client: {
  //     url: '',
  //     options: {
  //       dbName: '',
  //       user: '',
  //       password: '',
  //     }
  //   }
  // }
  // config.redis = {
  //   client: {
  //     port: 639,
  //     host: '',
  //     password: '',
  //     db: 0
  //   }
  // }

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
