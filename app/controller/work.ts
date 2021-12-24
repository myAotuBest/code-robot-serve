/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 11:42:14
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 17:00:23
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/controller/work.ts
 */
import { Controller } from 'egg'
import checkPermission from "../decorator/checkPermission"
import validateInput from "../decorator/inputValidate"
const workCreateRules = {
    title: 'string',
}
export const workErrorMessages = {
    workValidateFail: {
        errno: 102001,
        message: '输入信息验证失败',
    },
}

export interface IndexCondition {
    pageIndex?: number;//页数
    pageSize?: number;//每页返回多少条
    select?: string | string[];//返回哪些值
    populate?: { path?: string; select?: string; } | string;//关联哪些集合以及返回哪些值
    customSort?: Record<string, any>;//排序
    find?: Record<string, any>;//查询条件
}



export default class WorkController extends Controller {
    // private validateUserInput(rules: any) {
    //     const { ctx, app } = this
    //     // ctx.validate(userCreateRules)
    //     const errors = app.validator.validate(rules, ctx.request.body)
    //     ctx.logger.warn(errors)
    //     return errors
    // }
    @validateInput(workCreateRules, 'workValidateFail')
    async createWork() {
        const { ctx, service } = this
        // const errors = this.validateUserInput(workCreateRules)
        // if (errors) {
        //     return ctx.helper.error({ ctx, errnoType: 'workValidateFail', error: errors })
        // }
        const workData = await service.work.createEmptyWork(ctx.request.body)
        ctx.helper.success({ ctx, res: workData })
    }
    async myList() {
        const { ctx, service } = this
        const userId = ctx.state.user._id
        const { pageIndex, pageSize, isTemplate, title } = ctx.query
        const findConditon = {
            user: userId,
            ...(title && { title: { $regex: title, $options: 'i' } }),
            ...(isTemplate && { isTemplate: !!parseInt(isTemplate) })
        }
        const listCondition: IndexCondition = {
            select: 'id author copiedCount coverImg desc title user isHot createdAt',
            populate: { path: 'user', select: 'username nickName picture' },
            find: findConditon,
            ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
            ...(pageSize && { pageSize: parseInt(pageSize) })
        }
        const res = await service.work.getList(listCondition)
        ctx.helper.success({ ctx, res })
    }
    async templateList() {
        const { ctx } = this
        const { pageIndex, pageSize } = ctx.query
        const listCondition: IndexCondition = {
            select: 'id author copiedCount coverImg desc title user isHot createdAt',
            populate: { path: 'user', select: 'username nickName picture' },
            find: { isPublic: true, isTemplate: true },
            ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
            ...(pageSize && { pageSize: parseInt(pageSize) })
        }
        const res = await ctx.service.work.getList(listCondition)
        ctx.helper.success({ ctx, res })
    }
    // async checkPermission(id: number) {
    //     const { app, ctx } = this;
    //     //获取当前用户id
    //     const userId = ctx.state.user._id;
    //     //查询 作品
    //     const certianWork = await app.model.Work.findOne({ id });
    //     if (!certianWork) {
    //         return false;
    //     }
    //     //检查是否相等，特别注意转换成字符串
    //     return certianWork.user.toString() === userId;
    // }
    @checkPermission('Work', 'workNoPermissonFail')
    async update() {
        const { ctx } = this
        const { id } = ctx.params
        // const permission = await this.checkPermission(id)
        // if (!permission) {
        //     return ctx.helper.error({ ctx, errnoType: 'workNoPermissonFail' })
        // }
        const payload = ctx.request.body
        const res = await this.app.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean()
        ctx.helper.success({ ctx, res })
    }
    @checkPermission('Work', 'workNoPermissonFail')
    async delete() {
        const { ctx } = this
        const { id } = ctx.params
        // const permission = await this.checkPermission(id)
        // if (!permission) {
        //     return ctx.helper.error({ ctx, errnoType: 'workNoPermissonFail' })
        // }
        const res = await this.app.model.Work.findOneAndDelete({ id }).select('_id id title').lean()
        ctx.helper.success({ ctx, res })
    }
    @checkPermission('Work', 'workNoPermissonFail')
    async publish(isTemplate: boolean) {
        const { ctx } = this
        const url = await this.service.work.publish(ctx.params.id, isTemplate)
        ctx.helper.success({ ctx, res: { url } })
    }
    async publishWork() {
        await this.publish(false)
    }
    async publishTemplate() {
        await this.publish(true)
    }

}