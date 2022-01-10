/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-09 15:52:58
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
  // const jwtMiddleware = app.jwt as any
  router.prefix('/api');//路由前缀  /api/users/getUserInfo
  router.get('/', controller.home.index);
  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.show);
  router.get('/users/testCookie', controller.user.testCookie);
  router.post('/users/login', controller.user.loginByEmail);
  router.post('/users/genVeriCode', controller.user.sendVeriCode);
  router.post('/users/loginByCellPhone', controller.user.loginByCellPhone);
  router.get('/users/passport/gitee', controller.user.oauth);
  router.get('/users/passport/gitee/callback', controller.user.oauthByGitee);

  router.post('/works', controller.work.createWork)
  router.get('/works/list', controller.work.myList)
  router.get('/templates', controller.work.templateList)
  router.patch('/works/:id', controller.work.update)
  router.delete('/works/:id', controller.work.delete)
  router.post('/works/publish/:id', controller.work.publishWork)
  router.post('/works/publish-template/:id', controller.work.publishTemplate)


  router.post('/utils/upload-img', controller.utils.uploadMutipleFiles)
  router.get('/utils/page/:idAndUuid', controller.utils.renderToH5Page)

  router.post('/channels/create', controller.work.createChannel)
  router.get('/channels/getWorkChannel/:id', controller.work.getWorkChannel)
  router.patch('/channels/updateName/:id', controller.work.updateChannelName)
  router.delete('/channels/:id', controller.work.deleteChannel)
};
