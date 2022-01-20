/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-16 14:50:58
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-20 14:29:58
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/controller/user.ts
 */
import { Controller } from 'egg';
import validateInput from "../decorator/inputValidate"

const userCreateRules = {
    username: 'email',
    password: { type: 'password', min: 8 }
};
const sendCodeRules = {
    phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' }
}

const userPhoneCreateRules = {
    phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
    veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' }
}


export default class HomeController extends Controller {
    //创建用户
    @validateInput(userCreateRules, 'userValidateFail')
    public async createByEmail() {
        const { ctx, service } = this;
        // const errors = this.validateUserInput(userCreateRules);
        // if (errors) {
        //     return ctx.helper.error({ ctx, errnoType: 'userValidateFail', error: errors });
        // }
        const { username } = ctx.request.body;
        //查询用户是否被注册
        const user = await service.user.findByUserName(username);
        if (user) {
            return ctx.helper.error({ ctx, errnoType: 'createUserAleadyExists' })
        }

        const userData = await service.user.createByEmail(ctx.request.body);
        ctx.helper.success({ ctx, res: userData });
    }
    validateUserInput(rules: any) {
        const { ctx, app } = this;
        // ctx.validate(userCreateRules);
        const errors = app.validator.validate(rules, ctx.request.body);
        return errors
    }
    //发送验证码
    @validateInput(sendCodeRules, 'userValidateFail')
    async sendVeriCode() {
        const { ctx, app, service } = this;
        const { phoneNumber } = ctx.request.body;
        // const errors = this.validateUserInput(sendCodeRules);
        // if (errors) {
        //     return ctx.helper.error({ ctx, errnoType: 'userValidateFail', error: errors });
        // }
        //获取redis数据
        //phoneNumber-1333333333333
        const preVeriCode = await app.redis.get(`phoneNumber-${phoneNumber}`);
        //判断是否存在
        if (preVeriCode) {
            return ctx.helper.error({ ctx, errnoType: 'sendVeriCodeFrequentFailInfo' });
        }
        //生成随机四位数
        const veriCode = (Math.floor(Math.random() * 9000) + 1000).toString();
        if (app.config.env === 'prod') {
            const resp = await service.user.sendSMS(phoneNumber, veriCode);
            if (resp.body.code !== 'OK') {
                return ctx.helper.error({ ctx, errnoType: 'sendVeriCodeError' });
            }
        }
        await app.redis.set(`phoneNumber-${phoneNumber}`, veriCode, 'ex', 60);
        ctx.helper.success({ ctx, msg: '验证码发送成功', res: app.config.env === 'local' ? { veriCode } : null });
    }
    //登录
    @validateInput(userCreateRules, 'userValidateFail')
    async loginByEmail() {
        const { ctx, service, app } = this;
        // const errors = this.validateUserInput(userCreateRules);
        // if (errors) {
        //     return ctx.helper.error({ ctx, errnoType: 'userValidateFail', error: errors });
        // }
        //根据用户username获取用户信息
        const { username, password } = ctx.request.body;
        const user = await service.user.findByUserName(username);
        //检查用户是否存在
        if (!user) {
            return ctx.helper.error({ ctx, errnoType: 'loginCheckFailInfo' })
        }
        const verifyPwd = await ctx.compare(password, user.password);
        if (!verifyPwd) {
            return ctx.helper.error({ ctx, errnoType: 'loginCheckFailInfo' })
        }
        // ctx.cookies.set('username', user.username, { encrypt: true });
        // ctx.session.username = user.username;
        const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires })
        ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })

    }
    //验证码登录
    @validateInput(userPhoneCreateRules, 'userValidateFail')
    async loginByCellPhone() {
        const { ctx, service, app } = this;
        const { phoneNumber, veriCode } = ctx.request.body;
        // const errors = this.validateUserInput(userPhoneCreateRules);
        // if (errors) {
        //     return ctx.helper.error({ ctx, errnoType: 'userValidateFail', error: errors });
        // }
        //验证码是否正确
        const preVeriCode = await app.redis.get(`phoneNumber-${phoneNumber}`);
        if (preVeriCode !== veriCode) {
            return ctx.helper.error({ ctx, errnoType: 'loginVeriCodeIncorrectFailInfo' });
        }
        const token = await service.user.loginByCellPhone(phoneNumber);
        ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })
    }

    async oauthByGitee() {
        const { ctx } = this
        const { code } = ctx.request.query
        try {
            const token = await ctx.service.user.loginByGitee(code)
            await ctx.render('success.nj', { token })
            // ctx.helper.success({ ctx, res: { token } })
        } catch (e) {
            return ctx.helper.error({ ctx, errnoType: 'giteeOauthError' })
        }
    }

    async show() {
        const { ctx, service } = this;
        const userData = await service.user.findByUserName(ctx.state.user.username);
        ctx.helper.success({ ctx, res: userData });
    }

    async testCookie() {
        const { ctx, service } = this;
        // const username = ctx.cookies.get('username', { encrypt: true });
        // const { username } = ctx.session;

        // const token = this.getTokenValue();
        // if (!token) {
        //     return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })
        // }
        // try {
        //     const decoded = verify(token, app.config.jwt.secret);
        //     ctx.helper.success({ ctx, res: decoded });
        // } catch (e) {
        //     return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })

        // }

        // if (!username) {
        //     return ctx.helper.error({ ctx, errnoType: 'loginValidateFail' })
        // }
        // ctx.helper.success({ ctx, res: username });

        const userData = await service.user.findByUserName(ctx.state.user.username);
        if (!userData) {
            return ctx.helper.error({ ctx, errnoType: 'loginCheckFailInfo' })
        }
        ctx.helper.success({ ctx, res: userData.toJSON() });
    }
    async oauth() {
        const { app, ctx } = this
        const { cid, redirectURL } = app.config.giteeOauthConfig
        ctx.redirect(`https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`)
    }
}
