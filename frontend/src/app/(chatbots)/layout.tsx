/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-31 04:16:36
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 05:55:16
 * @FilePath: /builder6/frontend/src/app/(app)/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { GlobalFooter } from '@/components/site/GlobalFooter'
import AppHeader from '@/components/site/AppHeader'
import { Providers } from './_components/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
      {/* <AppHeader /> */}
      {children}
      </Providers>

  )
}
