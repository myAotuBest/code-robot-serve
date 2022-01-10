/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-10 17:26:11
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-09 16:24:58
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/model/user.ts
 */
import { Application } from 'egg';
import { Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
export interface UserProps {
    username: string;
    password: string;
    email?: string;
    nickName?: string;
    picture?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'email' | 'cellphone' | 'oauth';
    provider?: 'gitee';
    oauthID?: string;
    role?: 'admin' | 'normal';
}

function initUserModel(app: Application) {
    const AutoIncrement = AutoIncrementFactory(app.mongoose);
    const UserSchema = new Schema<UserProps>({
        username: { type: String, unique: true, required: true },
        password: { type: String },
        nickName: { type: String },
        picture: { type: String },
        email: { type: String },
        phoneNumber: { type: String },
        type: { type: String, default: 'email' },
        provider: { type: String },
        oauthID: { type: String },
        role: { type: String, default: 'normal' },
    }, {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.password;
                delete ret.__v;
            },
        },
    });
    //添加自增id
    UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id_counter' });
    return app.mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;
