'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Menu, X, Search, User2, LogOut, Heart, User, Film, Home, Globe, Clapperboard } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/navigation'
import AuthModal from '@/components/user/AuthModal'
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user, setUser } = useUser();
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
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
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-4'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold whitespace-nowrap">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Clapperboard size={24} className="text-black" />
            </div>
            <span className="hidden sm:inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Movie<span className="font-normal">App</span>
            </span>
          </Link>

          {/* Nav - Desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-1 text-sm flex-1 max-w-2xl mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group relative"
              >
                <span className="group-hover:text-yellow-400 transition-colors">
                  {item.label}
                </span>
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-500 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Form - Desktop */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 pr-10 py-2 rounded-full bg-white/30 placeholder-gray-100 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all w-40 lg:w-52 duration-300"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-yellow-400">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Thành viên */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {user ? (
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex cursor-pointer items-center gap-2 text-sm hover:text-yellow-400 transition focus:outline-none relative"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-yellow-400 transition-all"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-full w-9 h-9 flex items-center justify-center font-bold uppercase text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden lg:inline max-w-[120px] truncate">{user.name}</span>
                </button>
              ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)} 
                  className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                >
                  Đăng nhập
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && user && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl z-50 p-2 border border-gray-800"
                  >
                    <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-800">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold uppercase">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link href="/user/profile" className="flex items-center gap-3 px-3 py-2.5 mt-2 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors">
                      <User size={18} className="text-yellow-500" />
                      <span>Tài khoản</span>
                    </Link>
                    <Link href="/user/favorites" className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors">
                      <Heart size={18} className="text-yellow-500" />
                      <span>Yêu thích</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full cursor-pointer text-left flex items-center gap-3 px-3 py-2.5 mt-2 text-gray-300 hover:bg-red-900/50 hover:text-white rounded-lg transition-colors">
                      <LogOut size={18} className="text-red-400" />
                      <span className='cursor-pointer'>Đăng xuất</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger - Mobile */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => document.getElementById('mobile-search')?.focus()} 
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Search size={22} />
              </button>
              <button 
                onClick={toggleMenu} 
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${menuOpen ? 'bg-white/10' : ''}`}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden px-4 mt-3 mb-2 flex items-center gap-2">
          <input
            id="mobile-search"
            type="text"
            placeholder="Tìm phim, diễn viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-white/10 placeholder-gray-300 text-white text-sm outline-none flex-1"
          />
          <button type="submit" className="text-yellow-400 hover:text-yellow-300 p-2">
            <Search size={20} />
          </button>
        </form>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pb-6 pt-2 bg-black/90 backdrop-blur-lg">
                <nav className="flex flex-col space-y-1 text-sm">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      {getIconForNavItem(item.label)}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  
                  <div className="mt-4 pt-3 border-t border-gray-800">
                    {user ? (
                      <>
                        <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" onClick={closeMenu}>
                          <User2 size={20} className="text-yellow-500" />
                          <span>Tài khoản: {user.name}</span>
                        </Link>
                        <Link href="/user/favorites" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" onClick={closeMenu}>
                          <Heart size={20} className="text-yellow-500" />
                          <span>Yêu thích</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/50 transition-colors">
                          <LogOut size={20} className="text-red-400" />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => {
                          setAuthModalOpen(true)
                          closeMenu()
                        }} 
                        className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-medium"
                      >
                        <User2 size={20} />
                        <span>Đăng nhập</span>
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thể loại', href: '/the-loai' },
  { label: 'Quốc gia', href: '/quoc-gia' },
  { label: 'Phim chiếu rạp', href: '/phim-chieu-rap' },
  { label: 'TV Shows', href: '/tv-shows' },
]

// Helper function to get icons for mobile nav items
const getIconForNavItem = (label: string) => {
  switch(label) {
    case 'Trang chủ': return <Home size={20} className="text-yellow-500" />;
    case 'Thể loại': return <Film size={20} className="text-yellow-500" />;
    case 'Quốc gia': return <Globe size={20} className="text-yellow-500" />;
    case 'Phim chiếu rạp': return <Clapperboard size={20} className="text-yellow-500" />;
    case 'TV Shows': return <div className="bg-red-600 w-5 h-5 rounded flex items-center justify-center text-xs text-white">TV</div>;
    default: return <div className="w-5 h-5" />;
  }
}