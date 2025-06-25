'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Menu, X, Search, User2, LogOut, Heart, User } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import AuthModal from '@/components/user/AuthModal'
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user, setUser } = useUser(); // ✅ lấy từ Context
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchTerm)}`
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 shadow-md ${scrolled ? 'bg-black shadow-lg' : 'bg-white/5 backdrop-blur-md'} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            🎬 MovieApp
          </Link>

          {/* Nav - Desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-8 text-sm flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-yellow-500 transition duration-200 hover:underline decoration-yellow-500 decoration-2 underline-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Form - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm phim , diễn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/20 placeholder-gray-300 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition w-36 md:w-48"
            />
            <button type="submit" className="text-yellow-400 hover:text-yellow-300">
              <Search size={20} />
            </button>
          </form>

          {/* Thành viên */}
          <div className="hidden md:block ml-4 relative" ref={dropdownRef}>
            {user ? (
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex cursor-pointer items-center gap-2 text-sm hover:text-yellow-400 transition focus:outline-none">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden lg:inline">{user.name}</span>
              </button>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                Đăng nhập
              </button>
            )}

            {/* Dropdown */}
            {dropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-2 border border-gray-200 dark:border-gray-700 animate-fade-in-down">
                <Link href="/user/profile" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-blue-500 hover:text-white rounded-md transition-colors duration-200 flex items-center gap-3">
                  <User size={18} />
                  Tài khoản
                </Link>
                <Link href="/user/favorites" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-pink-500 hover:text-white rounded-md transition-colors duration-200 flex items-center gap-3 mt-1">
                  <Heart size={18} />
                  Yêu thích
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-red-500 hover:text-white rounded-md transition-colors duration-200 flex items-center gap-3">
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Hamburger - Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4">
            <nav className="flex flex-col space-y-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="hover:text-yellow-500 transition duration-200"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/user/profile" className="flex items-center gap-2 mt-2 text-yellow-400" onClick={closeMenu}>
                    <User2 size={20} />
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="text-left mt-2 text-red-400">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <button onClick={() => setAuthModalOpen(true)} className="text-yellow-400 mt-2">
                  Đăng nhập
                </button>
              )}
            </nav>

            {/* Search - Mobile */}
            <form onSubmit={handleSearch} className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-white/20 placeholder-gray-300 text-white text-sm outline-none flex-1"
              />
              <button type="submit" className="text-yellow-400 hover:text-yellow-300">
                <Search size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Thể loại', href: '/the-loai' },
  { label: 'Quốc gia', href: '/quoc-gia' },
  { label: 'Phim Việt Nam chiếu rạp', href: '/phim-chieu-rap-vn' },
]
