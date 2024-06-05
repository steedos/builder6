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