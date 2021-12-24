/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 11:46:26
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 17:03:40
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/service/work.ts
 */
import { Service } from 'egg';
import { nanoid } from 'nanoid'
import { WorkProps } from "../model/work";
import { Types } from 'mongoose'
import { IndexCondition } from "../controller/work";

const defaultIndexCondition: Required<IndexCondition> = {
    pageIndex: 0,
    pageSize: 10,
    select: '',
    populate: '',
    customSort: { createdAt: -1 },
    find: {}
}

export default class WorkService extends Service {
    async createEmptyWork(payload) {
        const { ctx, app } = this;
        //拿到对应的user id
        const { username, _id } = ctx.state.user;
        //拿到一个独一无二的 URL id
        const uuid = nanoid(6);
        const newEmptyWork: Partial<WorkProps> = {
            ...payload,
            user: new Types.ObjectId(_id),
            author: username,
            uuid
        }
        return app.model.Work.create(newEmptyWork);
    }
    async getList(condition: IndexCondition) {
        const fcondition = { ...defaultIndexCondition, ...condition }
        const { pageIndex, pageSize, select, populate, customSort, find } = fcondition
        const skip = pageIndex * pageSize
        const res = await this.app.model.Work
            .find(find).select(select).populate(populate)
            .skip(skip)
            .limit(pageSize)
            .sort(customSort)
            .lean()
        const count = await this.app.model.Work.find(find).count()
        return { count, list: res, pageSize, pageIndex }
    }
    async publish(id: number, isTemplate = false) {
        const { ctx, app } = this
        const { H5BaseURL } = ctx.app.config
        const payload: Partial<WorkProps> = {
            status: 2,
            latestPublishAt: new Date(),
            ...(isTemplate && { isTemplate: true })
        }
        const res = await app.model.Work.findOneAndUpdate({ id }, payload, { new: true })
        const { uuid } = res
        return `${H5BaseURL}/p/${id}-${uuid}`
    }
}