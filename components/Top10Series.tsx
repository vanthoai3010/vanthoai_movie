'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Top10Series() {
    const [movies, setMovies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTop10 = async () => {
            setLoading(true)
            try {
                const res = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&country=han-quoc&year=2024&limit=10')
                const data = await res.json()
                setMovies(data.data.items)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchTop10()
    }, [])

    return (
        <section className="px-4 md:px-8 lg:px-12 py-12 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            <span className="text-red-500">TOP 10</span> PHIM BỘ HÀN QUỐC
                        </h2>
                        <p className="text-gray-400 mt-2">Những bộ phim được xem nhiều nhất</p>
                    </div>
                    <Link 
                        href="/danh-sach/top-phim-bo" 
                        className="text-sm text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                    >
                        Xem tất cả
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="relative">
                                <Skeleton height={380} borderRadius={12} className="w-full" />
                                <div className="absolute -bottom-4 -left-2">
                                    <Skeleton circle width={48} height={48} />
                                </div>
                                <Skeleton height={20} className="mt-8 w-3/4" />
                                <Skeleton height={16} className="mt-2 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                            1280: { slidesPerView: 6 },
                        }}
                        navigation
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop
                        className="top10-slider"
                    >
                        {movies.map((movie, index) => (
                            <SwiperSlide key={movie._id}>
                                <div className="relative group h-full">
                                    {/* Ranking Number */}
                                    <div className="absolute -left-2 -top-2 z-10">
                                        <div className="relative">
                                            <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-lg">
                                                <path 
                                                    d="M24 0 L48 24 L24 48 L0 24 Z" 
                                                    fill="#E50914" 
                                                    className="group-hover:fill-red-600 transition-colors"
                                                />
                                            </svg>
                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Movie Card */}
                                    <div className="relative w-full h-[380px] rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                        <Link href={`/xem-phim/${movie.slug}`}>
                                            <Image
                                                src={`https://phimimg.com/${movie.poster_url}`}
                                                alt={movie.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            />
                                        </Link>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Episode Badges */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                                            {movie.episode_current && (
                                                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                                    Tập {movie.episode_current}
                                                </span>
                                            )}
                                            {movie.lang && (
                                                <span className="bg-white/90 text-black text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                                    {movie.lang}
                                                </span>
                                            )}
                                        </div>

                                        {/* Hover Info */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition-all duration-300 z-10">
                                            <div className="mb-3">
                                                <Link href={`/xem-phim/${movie.slug}`}>
                                                    <h3 className="text-white font-bold text-lg line-clamp-2 hover:text-yellow-400 transition-colors">
                                                        {movie.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-300 text-sm mt-1 line-clamp-1">
                                                    {movie.origin_name}
                                                </p>
                                                <div className="flex items-center mt-2 text-xs text-gray-400">
                                                    <span>{movie.year}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{movie.quality}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/xem-phim/${movie.slug}`}
                                                    className="flex-1"
                                                >
                                                    <button className="w-full py-2 px-3 bg-white cursor-pointer text-black text-sm font-semibold rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200">
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
                                                </Link>
                                                
                                                <button className="p-2 bg-gray-600/70 text-white cursor-pointer rounded hover:bg-gray-500 transition-colors duration-200">
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

                                    {/* Title Below */}
                                    <Link href={`/xem-phim/${movie.slug}`}>
                                        <h3 className="text-white text-sm md:text-base mt-3 font-semibold line-clamp-1 hover:text-yellow-400 transition-colors">
                                            {movie.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                        {movie.origin_name}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            <style jsx global>{`
                .top10-slider {
                    padding: 8px 0 24px;
                }
                
                .top10-slider .swiper-slide {
                    transition: transform 0.3s ease;
                }
                
                .top10-slider .swiper-slide:hover {
                    transform: scale(1.05) translateY(-8px);
                }
                
                .top10-slider .swiper-button-next,
                .top10-slider .swiper-button-prev {
                    width: 40px;
                    height: 40px;
                    background-color: rgba(229, 9, 20, 0.8);
                    color: white;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .top10-slider .swiper-button-next:hover,
                .top10-slider .swiper-button-prev:hover {
                    background-color: rgba(229, 9, 20, 1);
                    transform: scale(1.1);
                }
                
                .top10-slider .swiper-button-next::after,
                .top10-slider .swiper-button-prev::after {
                    font-size: 18px;
                    font-weight: bold;
                }
            `}</style>
        </section>
    )
}