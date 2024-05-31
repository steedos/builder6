import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { GlobalFooter } from '@/components/site/GlobalFooter'
import Header from '@/components/site/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto min-h-full">
        {children}
      </div>
    </>
  )
}
