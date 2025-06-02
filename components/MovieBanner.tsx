'use client'
import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'

interface Category {
    id: string
    name: string
    slug: string
}

interface Movie {
    _id: string
    name: string
    slug: string
    thumb_url: string
    poster_url: string
    year: string
    time: string
    origin_name: string
    content: string
    vote_average: number
    episode_current: string
    quality: string
    category: Category[]
}

export default function MovieBanner() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<any>(null)
    const fixedSlugs = [
        'lanh-dia-tu-chien',
        'cung-dien-ma-am',
        'one-nguoi-hung-trung-hoc',
        'dem-thanh-doi-san-quy',
        'quat-mo-trung-ma',
        'tham-tu-lung-danh-conan-ngoi-sao-5-canh-1-trieu-do',
    ]


    useEffect(() => {
        const fetchFixedMovies = async () => {
            try {
                const fetchedMovies: Movie[] = await Promise.all(
                    fixedSlugs.map(async (slug) => {
                        const res = await fetch(`https://phimapi.com/phim/${slug}`)
                        const data = await res.json()

                        if (data.status === true && data.movie) {
                            return data.movie
                        } else {
                            console.warn(`Không tìm thấy phim với slug: ${slug}`, data)
                            return null
                        }
                    })
                )

                // Lọc ra những phim hợp lệ (không null)
                setMovies(fetchedMovies.filter((m): m is Movie => m !== null))
            } catch (error) {
                console.error("Lỗi khi fetch phim:", error)
            }
        }

        fetchFixedMovies()
    }, [])



    return (
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] text-white">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                loop
                modules={[Autoplay]}
                className="h-full"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie._id}>
                        <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
                            <Image
                                src={movie.thumb_url}
                                alt={movie.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                className="object-cover movie-banner-image"
                                priority
                            />

                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.6)_0%,_transparent_60%)] z-[1]" />

                            <div className="relative z-10 h-full flex items-center justify-start px-4 md:px-12 lg:px-20 pt-40 md:pt-60 lg:pt-80 text-left">
                                <div className="max-w-full sm:max-w-xl cursor-pointer">
                                    {/* Nội dung dành cho mobile */}
                                    <div className="block md:hidden mt-25">
                                        <Link href={`/xem-phim/${movie.slug}`}>
                                            <h1 className="text-xl font-bold mb-2">{movie.name}</h1>
                                        </Link>
                                        <h2 className="text-sm text-yellow-500 italic mb-4">
                                            {movie.origin_name} ({movie.year})
                                        </h2>

                                        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                                            <span className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded">
                                                {movie.episode_current ? `${movie.episode_current}` : 'Hoàn thành'}
                                            </span>
                                            <span className="bg-gray-200 text-black font-semibold px-2 py-1 rounded">{movie.year}</span>
                                        </div>
                                    </div>

                                    {/* Nội dung chi tiết cho md trở lên */}
                                    <div className="hidden md:block">
                                        <Link href={`/xem-phim/${movie.slug}`}>
                                            <h1 className="text-xl md:text-4xl lg:text-3xl  hover:text-yellow-300 font-bold mb-2 ">{movie.name}</h1>
                                        </Link>
                                        <h2 className="text-sm text-yellow-400 italic mb-4">
                                            {movie.origin_name} ({movie.year})
                                        </h2>

                                        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                                            <span className="bg-yellow-500 text-black font-semibold px-2 py-0.5 rounded">
                                                {movie.episode_current ? `Tập ${movie.episode_current}` : 'Hoàn thành'}
                                            </span>
                                            <span className="bg-gray-200 text-black font-semibold px-2 py-0.5 rounded">{movie.quality}</span>
                                            <span className="bg-gray-200 text-black font-semibold px-2 py-0.5 rounded">{movie.time}</span>
                                            <span className="bg-gray-200 text-black font-semibold px-2 py-0.5 rounded">{movie.year}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {movie.category.map((cat) => (
                                                <Link key={cat.slug} href={`/the-loai/${cat.slug}`}>
                                                    <span className="bg-gray-700 bg-opacity-50 text-gray-200 text-sm px-3 py-2 rounded-xl hover:bg-gray-600 transition">
                                                        {cat.name}
                                                    </span>
                                                </Link>
                                            ))}
                                            <p className="text-sm text-gray-300 mt-5 mb-6 line-clamp-3 max-w-xl">{movie.content}</p>
                                        </div>


                                        <div className="flex gap-4">
                                            <Link href={`/xem-phim/${movie.slug}`}>
                                                <button className="bg-yellow-400 cursor-pointer text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
                                                    ▶ Xem phim
                                                </button>
                                            </Link>
                                            <button className="bg-white/20 cursor-pointer hover:bg-white/30 text-white px-4 py-2 rounded-full transition">
                                                🤍 Yêu thích
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail chọn phim */}
            <div className="absolute  bottom-4 left-0 right-0 z-20 flex justify-center px-4">
                <div className="flex gap-2 overflow-x-auto bg-black/30 p-2 rounded-xl backdrop-blur-md scrollbar-hide max-w-full sm:max-w-[90%]">
                    {movies.map((movie, index) => (
                        <button
                            key={movie._id}
                            onClick={() => {
                                swiperRef.current?.slideToLoop(index)
                                setActiveIndex(index)
                            }}
                            className={`min-w-[60px] h-[40px] rounded-md cursor-pointer overflow-hidden border-2 transition-all duration-300 
          ${index === activeIndex ? 'border-yellow-400 scale-110 brightness-110' : 'border-white/30 hover:border-yellow-400'}
        `}
                        >
                            <Image
                                src={movie.thumb_url}
                                alt={movie.name}
                                width={60}
                                height={40}
                                className="object-cover transition-transform duration-300"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
        </section>
    )
}
