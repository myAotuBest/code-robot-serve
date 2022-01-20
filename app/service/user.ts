/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-16 14:52:09
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-20 14:29:31
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/service/user.ts
 */
import { Service } from 'egg';
import { UserProps } from '../model/user';
import * as $Dysmsapi from '@alicloud/dysmsapi20170525'

interface GiteeUserResp {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    email: string;
}

export default class UserService extends Service {
    public async createByEmail(payload: UserProps) {
        const { app, ctx } = this;
        const { username, password } = payload;
        const hash = await ctx.genHash(password);
        const userCreateData: Partial<UserProps> = {
            username,
            password: hash,
            email: username,
        };
        return app.model.User.create(userCreateData);
    }
    async findById(id: string) {
        return this.app.model.User.findById(id);
    }
    async findByUserName(username: string) {
        return this.app.model.User.findOne({ username })
    }
    async loginByCellPhone(phoneNumber: string) {
        const { app } = this;
        const user = await this.findByUserName(phoneNumber);
        //判断用户是否存在
        if (user) {
            const token = await app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
            return token;
        }
        //如果不存在，创建一个用户
        const newCreatedData: Partial<UserProps> = {
            username: phoneNumber,
            phoneNumber: phoneNumber,
            nickName: `robot${phoneNumber.slice(-4)}`,
            type: 'cellphone'
        }
        const newUser = await app.model.User.create(newCreatedData);
        const token = await app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
        return token;
    }
    //发送短信
    async sendSMS(phoneNumber: string, veriCode: string) {
        const { app } = this;
        //配置参数
        let sendSMSRequest = new $Dysmsapi.SendSmsRequest({
            phoneNumbers: phoneNumber,
            signName: '测试专用模板',
            templateCode: 'SMS_154950909',
            templateParam: `您正在使用阿里云短信测试服务，体验验证码是：${veriCode}，如非本人操作，请忽略本短信！`,
        });
        const resp = await app.ALClient.sendSms(sendSMSRequest)
        return resp
    }
    // get access token
    async getAccessToken(code: string) {
        const { ctx, app } = this
        const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig
        const { data } = await ctx.curl(authURL, {
            method: 'POST',
            contentType: 'json',
            dataType: 'json',
            data: {
                code,
                client_id: cid,
                redirect_uri: redirectURL,
                client_secret: secret
            }
        })
        app.logger.info(data)
        return data.access_token
    }
    // get gitee user data
    async getGiteeUserData(access_token: string) {
        const { ctx, app } = this
        const { giteeUserAPI } = app.config.giteeOauthConfig
        const { data } = await ctx.curl<GiteeUserResp>(`${giteeUserAPI}?access_token=${access_token}`, {
            dataType: 'json'
        })
        app.logger.info(data)
        return data
    }
    async loginByGitee(code: string) {
        const { app } = this
        // 获取 access_token
        const accessToken = await this.getAccessToken(code)
        // 获取用户的信息
        const user = await this.getGiteeUserData(accessToken)
        // 检查用户信息是否存在
        const { id, name, avatar_url, email } = user
        const stringId = id.toString()
        // Gitee + id
        // Github + id
        // WX + id
        // 假如已经存在
        const existUser = await this.findByUserName(`Gitee${stringId}`)
        if (existUser) {
            const token = app.jwt.sign({ username: existUser.username, _id: existUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires })
            return token
        }
        // 假如不存在，新建用户
        const userCreatedData: Partial<UserProps> = {
            oauthID: stringId,
            provider: 'gitee',
            username: `Gitee${stringId}`,
            picture: avatar_url,
            nickName: name,
            email,
            type: 'oauth'
        }
        const newUser = await app.model.User.create(userCreatedData)
        const token = app.jwt.sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires })

        return token
    }
}
