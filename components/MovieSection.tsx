'use client'

import { useEffect, useState } from 'react'
import { fetchMoviesByNation } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface NationMovieSectionProps {
  nation: {
    slug: string
    name: string
  }
}

const colorClassByNationSlug: Record<string, string> = {
  'han-quoc': 'text-pink-500',
  'trung-quoc': 'text-red-500',
  'au-my': 'text-blue-400',
  'nhat-ban': 'text-amber-500',
  'thai-lan': 'text-purple-400',
  'dai-loan': 'text-green-400',
  'hong-kong': 'text-yellow-400',
  'an-do': 'text-orange-400',
}

export default function NationMovieSection({ nation }: NationMovieSectionProps) {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchMoviesByNation(nation.slug)
        setMovies(data)
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [nation.slug])

  return (
    <section className="px-4 md:px-8 lg:px-12 py-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Title Section */}
          <div className="w-full md:min-w-[220px] md:w-[220px] mt-10 lg:w-[260px]">
            <h2
              className={`text-2xl lg:text-3xl font-bold uppercase tracking-wide ${colorClassByNationSlug[nation.slug] || 'text-white'}`}
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                lineHeight: '1.2'
              }}
            >
              {nation.name}
              <span className="block text-white text-lg lg:text-xl mt-1">Phim mới cập nhật</span>
            </h2>
            <Link
              href={`/quoc-gia/${nation.slug}`}
              className="inline-flex items-center mt-4 text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-200 group"
            >
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Movie Slider */}
          <div className="flex-1 min-h-[320px] min-w-0 relative">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="relative group">
                    <Skeleton height={280} borderRadius={8} className="w-full" />
                    <Skeleton height={20} className="mt-3 w-3/4" />
                    <Skeleton height={16} className="mt-1 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
                navigation={{
                  nextEl: `.next-${nation.slug}`,
                  prevEl: `.prev-${nation.slug}`,
                }}
                modules={[Navigation, Autoplay]}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop
                className="netflix-slider"
              >
                {movies.map((movie) => (
                  <SwiperSlide key={movie._id}>
                    <div className="relative group w-full h-full rounded-lg overflow-hidden transition-all duration-300 hover:z-10">
                      {/* Main Movie Card */}
                      <Link href={`/xem-phim/${movie.slug}`}>
                        <div className="relative w-full h-[280px] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
                          <Image
                            src={`https://phimimg.com/${movie.thumb_url}`}
                            alt={movie.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />

                          {/* Episode Badge */}
                          {movie.episode_current && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md shadow-md">
                              {movie.episode_current}
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Hover Info */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition-all duration-300 z-10">
                            <div className="mb-2">
                              <h3 className="text-white font-bold text-sm md:text-base line-clamp-2">{movie.name}</h3>
                              <p className="text-gray-300 text-xs mt-1 line-clamp-1">{movie.origin_name}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-400">
                                <span>{movie.year}</span>
                                <span className="mx-1">•</span>
                                <span>{movie.quality}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">

                              <button className="w-full py-2 px-3 cursor-pointer bg-white text-black text-xs font-semibold rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Xem ngay
                              </button>
                              <button className="p-2 bg-gray-600/70 cursor-pointer text-white rounded hover:bg-gray-500 transition-colors duration-200">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    {/* Title Below */}
                    <Link href={`/xem-phim/${movie.slug}`}>
                      <h3 className="text-white text-sm md:text-base mt-3 font-semibold line-clamp-1 hover:text-yellow-400 transition-colors">
                        {movie?.name}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                      {movie?.origin_name}
                    </p>
                  </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <div className={`next-${nation.slug} absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/70 hover:bg-white/20 backdrop-blur-md rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className={`prev-${nation.slug} absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/70 hover:bg-white/20 backdrop-blur-md rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </Swiper>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .netflix-slider {
          padding: 8px 0 24px;
        }
        
        .netflix-slider .swiper-slide {
          transition: transform 0.3s ease;
        }
        
        .netflix-slider .swiper-slide:hover {
          transform: scale(1.05) translateY(-8px);
        }
        
        .netflix-slider .swiper-slide:not(:hover) {
          opacity: 0.9;
        }
        
        .next-${nation.slug}, .prev-${nation.slug} {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .netflix-slider:hover .next-${nation.slug},
        .netflix-slider:hover .prev-${nation.slug} {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}