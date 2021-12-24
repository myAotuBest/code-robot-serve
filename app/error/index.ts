/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 14:57:46
 * @LastEditors: Roy
 * @LastEditTime: 2021-12-24 15:00:25
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/error/index.ts
 */
import { userErrorMessages } from './user'
import { workErrorMessages } from './work'

export type GlobalErrorTypes = keyof (typeof userErrorMessages & typeof workErrorMessages);

export const globalErrorMessages = {
    ...userErrorMessages,
    ...workErrorMessages
}
