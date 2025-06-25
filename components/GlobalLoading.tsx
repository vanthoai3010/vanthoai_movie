// components/GlobalLoading.tsx
'use client'

import { useEffect, useState } from 'react'

export default function GlobalLoading({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cho loading trong 2–3 giây hoặc cho đến khi dữ liệu load xong
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-xl font-semibold">
        👋 Chào mừng bạn đến với web xem phim của tôi...
      </div>
    )
  }

  return <>{children}</>
}
