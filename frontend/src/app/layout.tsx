import type { Metadata } from 'next'
import { Nunito, Baloo_2 } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

const baloo2 = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['700', '800'],
  variable: '--font-baloo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NebulaEnglish – Học Tiếng Anh Thông Minh',
    template: '%s | NebulaEnglish',
  },
  description:
    'Học tiếng Anh thông minh với AI, cá nhân hóa lộ trình và chinh phục mọi chứng chỉ cùng NebulaEnglish.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${nunito.variable} ${baloo2.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
