'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
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
        <section className="px-4 py-8">

            {loading ? (
                <div className="flex gap-4 overflow-x-auto">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="min-w-[180px]">
                            <Skeleton height={260} borderRadius={8} />
                            <Skeleton height={20} className="mt-2" />
                            <Skeleton height={16} width={100} />
                        </div>
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={2}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        480: { slidesPerView: 1 },
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 6 },
                    }}
                    navigation
                >
                    {movies.map((movie, index) => (
                        <SwiperSlide key={movie._id} className="relative">
                            <div className="rounded-xl overflow-hidden relative group w-full aspect-[2/3] bg-gray-800">
                                <Link href={`/xem-phim/${movie.slug}`}>
                                    <img
                                        src={`https://phimimg.com/${movie.poster_url}`}
                                        alt={movie.name}
                                        className="swiper-lazy w-full h-full object-cover rounded-xl"
                                    />
                                </Link>
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
                                    <div className=" cursor-pointer w-[100%] max-w-xs bg-black/70 backdrop-blur-sm rounded-md p-3 shadow-lg transition-all">
                                        <Link href={`/xem-phim/${movie.slug}`}>
                                            <h3 className="text-sm font-semibold text-white hover:text-amber-400 cursor-pointer line-clamp-1">
                                                {movie.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-yellow-400 mt-1 cursor-pointer line-clamp-1">
                                            {movie.origin_name}
                                        </p>
                                        <Link href={`/xem-phim/${movie.slug}`}>
                                            <button className="mt-2 cursor-pointer px-9 py-2 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400 transition">
                                                ▶ Xem ngay
                                            </button>
                                        </Link>
                                        <button className="mt-2 ml-2 cursor-pointer px-2 py-2 text-xs rounded bg-gray-500 text-white transition">
                                           🤍 Thích
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                                    <span className='bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded'>
                                        PD. {movie.episode_current}{' '}
                                    </span>
                                    {movie.lang && (
                                        <span className="bg-emerald-400 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                            TM. {movie.lang}
                                        </span>
                                    )}
                                </div>

                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white" />
                            </div>
                            {/* Số thứ tự bên trái */}
                            <div className="mt-2 text-yellow-300 font-extrabold italic text-4xl">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </div>
                            { /* Tiêu đề dưới ảnh */}
                            <Link href={`/xem-phim/${movie.slug}`}>
                                <h3 className="text-white text-sm  hover:text-yellow-400 font-semibold line-clamp-1">
                                    {movie.name}
                                </h3>
                            </Link>
                            {/* Tên gốc dưới tiêu đề */}
                            <p className="text-yellow-400 text-xs italic line-clamp-1">
                                {movie.origin_name}
                            </p>
                            {/* Phần, tập */}
                            <p className="text-sm text-white mt-1">
                                {movie.season_text || 'T1'} • Phần 1 <span className='text-gray-50'>•</span> Tập {movie.episode_current}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    )
}
