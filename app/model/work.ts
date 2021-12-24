/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 11:19:06
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 11:20:21
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/model/work.ts
 */
import { Application } from 'egg'
import { ObjectId, Schema } from 'mongoose'
import * as AutoIncrementFactory from 'mongoose-sequence'

export interface WorkProps {
    id?: number;
    uuid: string;
    title: string;
    desc: string;
    coverImg?: string;
    content?: { [key: string]: any };
    isTemplate?: boolean;
    isPublic?: boolean;
    isHot?: boolean;
    author: string;
    copiedCount: number;
    status?: 0 | 1 | 2;
    user: ObjectId;
    latestPublishAt?: Date;
}

module.exports = (app: Application) => {
    const mongoose = app.mongoose
    const AutoIncrement = AutoIncrementFactory(mongoose)
    const WorkSchema = new Schema<WorkProps>({
        uuid: { type: String, unique: true },
        title: { type: String, required: true },
        desc: { type: String },
        coverImg: { type: String },
        content: { type: Object },
        isTemplate: { type: Boolean },
        isPublic: { type: Boolean },
        isHot: { type: Boolean },
        author: { type: String, required: true },
        copiedCount: { type: Number, default: 0 },
        status: { type: Number, default: 1 },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        latestPublishAt: { type: Date },
    }, { timestamps: true })
    WorkSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'works_id_counter' })
    return mongoose.model<WorkProps>('Work', WorkSchema)

}