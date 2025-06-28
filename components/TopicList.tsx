'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Movie, Favorite, Mic, Star, Tv, Public, TheaterComedy, RocketLaunch } from '@mui/icons-material'

interface Genre {
  name: string
  slug: string
}

// Icon mapping for genres
const getGenreIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  
  if (lowerName.includes('hành động')) return <RocketLaunch className="text-white w-8 h-8" />
  if (lowerName.includes('tình cảm')) return <Favorite className="text-white w-8 h-8" />
  if (lowerName.includes('âm nhạc')) return <Mic className="text-white w-8 h-8" />
  if (lowerName.includes('hài')) return <TheaterComedy className="text-white w-8 h-8" />
  if (lowerName.includes('tv')) return <Tv className="text-white w-8 h-8" />
  if (lowerName.includes('quốc tế')) return <Public className="text-white w-8 h-8" />
  
  return <Movie className="text-white w-8 h-8" />
}

// Subtle pastel colors
const colors = [
  'from-cyan-400/90 to-blue-500/90',
  'from-purple-400/90 to-indigo-500/90',
  'from-emerald-400/90 to-teal-500/90',
  'from-amber-400/90 to-orange-500/90',
  'from-rose-400/90 to-pink-500/90',
  'from-violet-400/90 to-purple-500/90',
  'from-sky-400/90 to-cyan-500/90',
  'from-lime-400/90 to-green-500/90',
]

export default function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch('https://phimapi.com/the-loai')
        const data = await res.json()
        setGenres(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGenres()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    )
  }

  const visible = showAll ? genres : genres.slice(0, 8)

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Khám phá thể loại
          </span>
        </h2>

        {!showAll && genres.length > 8 && (
          <Link href="/the-loai" className="hidden sm:block">
          <button
            onClick={() => setShowAll(false)}
            className="px-4 py-2 bg-white/10 cursor-pointer text-white rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition flex items-center gap-2"
          >
            Xem tất cả <span className="text-xl">→</span>
          </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {visible.map((g, i) => {
          const clr = colors[i % colors.length]
          return (
            <Link
              key={g.slug}
              href={`/the-loai/${g.slug}`}
              className="group relative block"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className={[
                  `bg-gradient-to-br ${clr} rounded-xl p-5 h-[150px] shadow-lg backdrop-blur-sm`,
                  hoveredIdx === i
                    ? 'scale-105 shadow-xl ring-2 ring-white/30'
                    : 'scale-100',
                  'transition-all duration-300 flex flex-col justify-between'
                ].join(' ')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-1 drop-shadow-md">
                      {g.name}
                    </h3>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    {getGenreIcon(g.name)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                    Khám phá ngay →
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-medium">4.5</span>
                  </div>
                </div>
              </div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 rounded-xl bg-no-repeat opacity-10"
                   style={{
                     backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1px)',
                     backgroundSize: '10px 10px',
                   }}
              />
            </Link>
          )
        })}
      </div>

      {showAll && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(false)}
            className="px-6 py-3 bg-gradient-to-r from-gray-600/50 to-gray-800/50 text-white rounded-full shadow-lg hover:opacity-90 transition backdrop-blur-sm border border-white/20"
          >
            Thu gọn ↑
          </button>
        </div>
      )}
    </section>
  )
}