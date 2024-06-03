/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 01:05:35
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-03 04:08:28
 * @FilePath: /builder6/frontend/src/app/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { SessionProvider } from "next-auth/react"
import '@/default.steedos.config'
import { getMainHeadCss, getMainHeadJs, getMainBodyJs } from '@/assets'

export const metadata: Metadata = {
  title: {
    template: '%s | 灵犀官网',
    default: '灵犀 - 智能连接，智造未来！',
  },
  description:
    '专注于帮助客户实现人工智能（AI）技术与业务系统之间的高效连接。无论您是小型初创企业还是大型企业，灵犀都将成为您数字化转型的得力助手。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = {};
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth',
      )}
    >
      <head>
        <link rel="icon" type="image/svg" href="/logo.svg"/>
        {getMainHeadCss()}
        {getMainHeadJs()}
      </head>
      <body className="flex h-full flex-col min-h-full bg-white antialiased dark:bg-zinc-900">
        <SessionProvider>
          {children}
        </SessionProvider>
        {getMainBodyJs(user)}
      </body>
    </html>
  )
}
