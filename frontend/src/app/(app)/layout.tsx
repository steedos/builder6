
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { GlobalFooter } from '@/components/GlobalFooter'
import AppHeader from '@/components/AppHeader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  )
}
