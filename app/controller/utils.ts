/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2022-01-06 16:07:37
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-08 18:05:42
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/controller/utils.ts
 */
import { Controller } from 'egg'
import * as sharp from 'sharp';
import { createWriteStream } from 'fs'
import { parse, join, extname } from 'path'
import { nanoid } from 'nanoid'
import { pipeline } from 'stream/promises'//node版本v15.0以上
import * as sendToWormhole from 'stream-wormhole'
import * as Busboy from 'busboy'
import { createSSRApp } from "vue";
import { renderToString, renderToNodeStream } from '@vue/server-renderer'
import { FileStream } from "../../typings/app";
export default class UtilsController extends Controller {

    async renderH5PageTest() {
        const { ctx } = this;
        const vueApp = createSSRApp({
            data: () => ({ msg: 'hello' }),
            template: '<h2>{{msg}}</h2>'
        });
        // const appContent = await renderToString(vueApp);
        // ctx.response.type = 'text/html';
        // ctx.body = appContent;
        //通过流的方式传递
        const stream = await renderToNodeStream(vueApp);
        ctx.status = 200;
        await pipeline(stream, ctx.res);
    }
    splitIdAndUuid(str = '') {
        const result = { id: 0, uuid: '' };
        if (!str) return result;
        const index = str.indexOf('-');
        if (index < 0) return result;
        result.id = Number(str.slice(0, index));
        result.uuid = str.slice(index + 1);
        return result;
    }
    async renderToH5Page() {
        //id-uid split('-')
        //uuid = aa-bb-cc
        const { ctx, app } = this;
        const { idAndUuid } = ctx.params;
        const query = this.splitIdAndUuid(idAndUuid);
        try {
            const pageData = await ctx.service.utils.renderToPageData(query);
            await ctx.render('page.nj', pageData);
        } catch (e) {
            ctx.helper.error({ ctx, errnoType: 'h5WorkNotExistError' })
        }
    }

    async uploadToOSS() {
        const { ctx, app } = this;
        const stream = await ctx.getFileStream();
        const uid = nanoid(6);
        // /robot-server-image/robot-server/**.ext
        const saveOSSPath = join('robot-server', uid + extname((await stream).filename));
        try {
            const result = await ctx.oss.put(saveOSSPath, stream)
            app.logger.info(result)
            const { name, url } = result
            ctx.helper.success({ ctx, res: { name, url } })
        } catch (e) {
            //消耗掉stream流
            await sendToWormhole(stream)
            ctx.helper.error({ ctx, errnoType: 'imageUploadFail' })
        }
    }
    uploadFileUseBusBoy() {
        const { ctx, app } = this;
        return new Promise<String[]>(resolve => {
            const busboy = Busboy({ headers: ctx.req.headers as any })
            const results: string[] = [];
            busboy.on('file', (name, stream, info) => {
                app.logger.info(name, stream, info);
                const uid = nanoid(6);
                const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname(info as any));
                stream.pipe(createWriteStream(saveFilePath));
                stream.on('end', () => {
                    results.push(saveFilePath)
                })
            })
            busboy.on('field', (name, value) => {
                app.logger.info(name, value);
            })
            busboy.on('finish', () => {
                app.logger.info('finish')
                resolve(results)
            });
            ctx.req.pipe(busboy);
        })
    }
    async testBusBoy() {
        const { ctx } = this;
        const results = await this.uploadFileUseBusBoy();
        ctx.helper.success({ ctx, res: results })
    }
    async uploadMutipleFiles() {
        const { ctx, app } = this;
        const { fileSize } = app.config.multipart
        const parts = ctx.multipart({ limits: { fileSize: fileSize as number } })
        // { urls: [xxx, xxx ]}
        const urls: string[] = []
        let part: FileStream | string[]
        while ((part = await parts())) {//当await parts()为undefield的时候说明已经没有可执行的part
            if (Array.isArray(part)) {
                app.logger.info(part)
            } else {
                try {
                    const savedOSSPath = join('robot-server', nanoid(6) + extname(part.filename))
                    const result = await ctx.oss.put(savedOSSPath, part)
                    const { url } = result
                    urls.push(url)
                    //判断图片是否超过上限
                    if (part.truncated) {
                        //超过上限就清除上传的图片
                        await ctx.oss.delete(savedOSSPath)
                        return ctx.helper.error({ ctx, errnoType: 'imageUploadFileSizeError', error: `Reach fileSize limit ${fileSize} bytes` })
                    }
                } catch (e) {
                    await sendToWormhole(part)//消费掉part
                    ctx.helper.error({ ctx, errnoType: 'imageUploadFail' })
                }
            }
        }
        ctx.helper.success({ ctx, res: { urls } })
    }
    async fileLocalUpload() {
        const { ctx, app } = this;
        const { filepath } = ctx.request.files[0];
        //生成sharp实例
        const imageSource = sharp(filepath);
        const metaData = await imageSource.metadata();
        let thumbnailUrl = '';
        //检查图片宽度是否大于300
        if (metaData.width && metaData.width > 300) {
            //获取图片的名字，图片后缀，图片所在目录
            const { name, ext, dir } = parse(filepath)
            const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`);
            //对图片进行裁剪
            await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
            thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
        }
        const url = filepath.replace(app.config.baseDir, app.config.baseUrl);
        ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } })
    }
    pathToURL(path: string) {
        const { app } = this;
        return path.replace(app.config.baseDir, app.config.baseUrl);
    }
    async fileUploadByStream() {
        const { ctx, app } = this;
        const stream = await ctx.getFileStream();
        const uid = nanoid(6);
        // /upload/**.ext
        // /upload/xx_thumbnail.ext
        const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname((await stream).filename));
        const saveThumbnailPath = join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname((await stream).filename));
        const target = createWriteStream(saveFilePath);
        const target2 = createWriteStream(saveThumbnailPath);
        // const savePromise = new Promise((resolve, reject) => {
        //     stream.pipe(target).on('finish', resolve).on('error', reject);
        // })
        const savePromise = pipeline(stream, target);
        const transformer = sharp().resize({ width: 300 });
        // const thumbailPromise = new Promise((resolve, reject) => {
        //     stream.pipe(transformer).pipe(target2).on('finish', resolve).on('error', reject);
        // })
        const thumbailPromise = pipeline(stream, transformer, target2)
        try {
            await Promise.all([savePromise, thumbailPromise]);
        } catch (e) {
            ctx.helper.error({ ctx, errnoType: 'imageUploadFail' })
        }
        ctx.helper.success({
            ctx, res: {
                url: this.pathToURL(saveFilePath),
                thumbnailUrl: this.pathToURL(saveThumbnailPath)
            }
        })
    }
}