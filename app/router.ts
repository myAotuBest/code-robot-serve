/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 17:00:30
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/router.ts
 */
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  //自定义jwt
  // const jwt = app.middleware.jwt({
  //   secret: app.config.jwt.secret
  // });
  const jwtMiddleware = app.jwt as any
  router.get('/', controller.home.index);
  router.post('/api/users/create', controller.user.createByEmail);
  router.get('/api/users', jwtMiddleware, controller.user.show);
  router.get('/api/users/testCookie', jwtMiddleware, controller.user.testCookie);
  router.post('/api/users/login', controller.user.loginByEmail);
  router.post('/api/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/api/users/loginByCellPhone', controller.user.loginByCellPhone);
  router.get('/api/users/passport/gitee', controller.user.oauth);
  router.get('/api/users/passport/gitee/callback', controller.user.oauthByGitee);

  router.post('/api/works', jwtMiddleware, controller.work.createWork)
  router.get('/api/works/list', jwtMiddleware, controller.work.myList)
  router.get('/api/templates', controller.work.templateList)
  router.patch('/api/works/:id', jwtMiddleware, controller.work.update)
  router.delete('/api/works/:id', jwtMiddleware, controller.work.delete)
  router.post('/api/works/publish/:id', jwtMiddleware, controller.work.publishWork)
  router.post('/api/works/publish-template/:id', jwtMiddleware, controller.work.publishTemplate)
};
