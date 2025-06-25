import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { UserProvider } from "@/context/UserContext";
import BackToTopButton from "@/components/BackToTopButton";


export const metadata: Metadata = {
  title: 'MovieApp',
  description: 'Website xem phim Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-900 text-gray-900 flex flex-col min-h-screen">
        <UserProvider>
          <Header />
          <main className="flex-grow p-4">{children}</main>
          <Footer />
        </UserProvider>
        <BackToTopButton />
      </body>
    </html>
  )
}
