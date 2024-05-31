import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { SessionProvider } from "next-auth/react"

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
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth',
      )}
    >
      <head>
        <link rel="icon" type="image/svg" href="/logo.svg"/>
      </head>
      <body className="flex h-full flex-col min-h-full bg-white antialiased dark:bg-zinc-900">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
