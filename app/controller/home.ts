/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-12-09 16:08:04
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-09 16:20:02
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/controller/home.ts
 */
import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');

  }
}
