'use client'

import { useEffect, useState } from 'react'
import { fetchMoviesByNation } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface NationMovieSectionProps {
    nation: {
        slug: string
        name: string
    }
}

const colorClassByNationSlug: Record<string, string> = {
    'han-quoc': 'text-pink-400',
    'trung-quoc': 'text-red-400',
    'au-my': 'text-blue-400',
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
        <section className="px-4 md:px-8 lg:px-12 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Title */}
                <div className="w-full md:min-w-[220px] md:w-auto">
                    <h2
                        className={`text-xl font-bold mt-6 md:mt-20 uppercase break-words ${colorClassByNationSlug[nation.slug] || 'text-white'} drop-shadow`}
                        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
                    >
                        {nation.name} <br />
                        mới
                    </h2>
                    <Link
                        href={`/quoc-gia/${nation.slug}`}
                        className="text-sm text-yellow-400 hover:underline"
                    >
                        Xem toàn bộ →
                    </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[280px] min-w-0">
                    {loading ? (
                        <div className="flex gap-4 overflow-x-auto">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="min-w-[180px]">
                                    <Skeleton height={260} borderRadius={8} />
                                    <Skeleton height={20} className="mt-2" />
                                    <Skeleton height={16} width={100} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1}
                            breakpoints={{
                                480: { slidesPerView: 1 },
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            navigation
                            modules={[Navigation]}
                            className="min-h-[280px]"
                        >
                            {movies.map((movie) => (
                                <SwiperSlide key={movie._id}>
                                    <div className="group w-full ">
                                        <Link href={`/xem-phim/${movie.slug}`} className="block rounded-lg overflow-hidden">
                                            <div className="relative w-full h-[200px] sm:h-[220px] md:h-[190px]">
                                                <Image
                                                    src={`https://phimimg.com/${movie.thumb_url}`}
                                                    alt={movie.name}
                                                    fill
                                                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                                    {movie.episode_current}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Hover Overlay */}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition duration-300 ease-out rounded-lg p-3 flex flex-col justify-end text-white z-10 shadow-lg overflow-hidden">
                                            {/* Background Image */}
                                            <div className="absolute inset-0 -z-10">
                                                <Image
                                                    src={`https://phimimg.com/${movie.poster_url}`}
                                                    alt={movie.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Nội dung nằm trên ảnh */}
                                            <div className="absolute bottom-4 left-4 w-[100%] max-w-xs bg-black/70 backdrop-blur-sm rounded-md p-3 shadow-lg transition-all">
                                                <h3 className="text-sm font-semibold text-white hover:text-amber-400 cursor-pointer line-clamp-1">
                                                    {movie.name}
                                                </h3>
                                                <p className="text-xs text-yellow-400 mt-1 cursor-pointer line-clamp-1">
                                                    {movie.origin_name}
                                                </p>
                                                <Link href={`/xem-phim/${movie.slug}`}>
                                                    <button className="mt-2 cursor-pointer px-10 py-2 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400 transition">
                                                        ▶ Xem ngay
                                                    </button>
                                                </Link>
                                                <button className="mt-2 ml-2 cursor-pointer px-4 py-2 text-xs rounded bg-gray-500 text-white transition">
                                                    🤍 Thích
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold hover:text-amber-400 text-white line-clamp-1">
                                        {movie.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 hover:text-amber-400 line-clamp-1">
                                        {movie.origin_name}
                                    </p>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
            <style jsx global>{`
  .swiper-button-next,
.swiper-button-prev {
  width: 40px !important;
  height: 40px !important;
  background-color: #facc15; /* vàng Tailwind: yellow-400 */
  color: black !important;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgb(250 204 21 / 0.5);
  transition: all 0.3s ease;
  top: 50% !important;
  transform: translateY(-50%);
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background-color: #eab308; /* yellow-500 */
  transform: translateY(-50%) scale(1.1);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 20px !important;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.swiper-button-next {
  right: 10px !important;
}

.swiper-button-prev {
  left: 10px !important;
}
`}</style>
        </section>
    )
}


