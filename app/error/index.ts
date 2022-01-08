/*
 * @message: 描述
 * @Author: Roy
 * @Email: cx_love_xc@163.com
 * @Github: cx_love_xc@163.com
 * @Date: 2021-12-24 14:57:46
 * @LastEditors: Roy
 * @LastEditTime: 2022-01-06 17:43:33
 * @Deprecated: 否
 * @FilePath: /code-robot-server/app/error/index.ts
 */
import { userErrorMessages } from './user'
import { workErrorMessages } from './work'
import { utilsErrorMessages } from './utils'

export type GlobalErrorTypes = keyof (typeof userErrorMessages & typeof workErrorMessages & typeof utilsErrorMessages);

export const globalErrorMessages = {
    ...userErrorMessages,
    ...workErrorMessages,
    ...utilsErrorMessages
}
