/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2022-01-06 17:41:24
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-06 17:41:24
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/error/utils.ts
 */
export const utilsErrorMessages = {
    imageUploadFail: {
        errno: 103001,
        message: '上传文件失败',
    },
    imageUploadFileFormatError: {
        errno: 103002,
        message: '不能上传这种文件格式，请上传图片格式',
    },
    imageUploadFileSizeError: {
        errno: 103003,
        message: '上传文件超过最大限制',
    },
    h5WorkNotExistError: {
        errno: 103004,
        message: '作品不存在'
    }
}