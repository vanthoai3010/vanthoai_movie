'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const closeMenu = () => setMenuOpen(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            window.location.href = `/tim-kiem?keyword=${encodeURIComponent(searchTerm)}`
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 shadow-md ${scrolled ? 'bg-black shadow-lg' : 'bg-white/5 backdrop-blur-md'
                } text-white`}
        >
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
                        className="px-4 py-2 rounded-md bg-white/20 placeholder-gray-300 text-white text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition w-56 md:w-72
 text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition w-36 md:w-48"
                    />
                    <button type="submit" className="text-yellow-400 hover:text-yellow-300">
                        <Search size={20} />
                    </button>
                </form>

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
    )
}

const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Thể loại', href: '/the-loai' },
    { label: 'Quốc gia', href: '/quoc-gia' },
    { label: 'Phim Việt Nam chiếu rạp', href: '/phim-chieu-rap-vn' },
]
