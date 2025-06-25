'use client'
import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Heart, Calendar, Clock, Film } from 'lucide-react'

// Import CSS cho Swiper và hiệu ứng Fade
import 'swiper/css'
import 'swiper/css/effect-fade'

// --- Interfaces (Giữ nguyên) ---
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
  episode_current: string
  quality: string
  category: Category[]
}

// --- Component Skeleton cho trạng thái Loading ---
const BannerSkeleton = () => (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-slate-800 animate-pulse">
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
            <div className="flex gap-2 bg-black/20 p-2 rounded-xl backdrop-blur-md">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-[80px] h-[45px] bg-slate-700 rounded-md" />
                ))}
            </div>
        </div>
    </section>
)

// --- Component con cho nội dung của từng Slide ---
const SlideContent = ({ movie, isActive }: { movie: Movie; isActive: boolean }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Hiệu ứng xuất hiện lần lượt cho các phần tử con
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    return (
        <motion.div
            className="relative z-10 h-full flex items-end md:items-center justify-center md:justify-start px-4 md:px-12 lg:px-24 pb-28 md:pb-0"
            variants={containerVariants}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
        >
            <div className="max-w-xl mt-50 text-center md:text-left">
                <motion.h2 variants={itemVariants} className="text-lg text-yellow-400 italic mb-2">
                    {movie.origin_name}
                </motion.h2>

                <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg mb-4">
                    <Link href={`/xem-phim/${movie.slug}`} className="hover:text-yellow-300 transition-colors duration-300">
                        {movie.name}
                    </Link>
                </motion.h1>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-sm mb-4 text-slate-200">
                    <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md">
                        <Film size={14} className="text-yellow-400" />
                        {movie.episode_current ? `${movie.episode_current}` : 'Hoàn thành'} ({movie.quality})
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md">
                        <Clock size={14} className="text-yellow-400" /> {movie.time}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md">
                        <Calendar size={14} className="text-yellow-400" /> {movie.year}
                    </span>
                </motion.div>

                <motion.p variants={itemVariants} className="text-sm text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                    {movie.content}
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex justify-center md:justify-start gap-4">
                    <Link href={`/xem-phim/${movie.slug}`}>
                        <button className="flex items-center gap-2 bg-yellow-400 cursor-pointer text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">
                            <Play size={20} /> Xem ngay
                        </button>
                    </Link>
                    <button className="flex items-center gap-2 bg-white/20 cursor-pointer hover:bg-white/30 text-white px-6 py-3 rounded-full font-bold transition-colors duration-300">
                        <Heart size={20} /> Yêu thích
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

// --- Component chính MovieBanner ---
export default function MovieBanner() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<any>(null)
    const fixedSlugs = [
        'lanh-dia-tu-chien', 'cung-dien-ma-am', 'one-nguoi-hung-trung-hoc',
        'dem-thanh-doi-san-quy', 'quat-mo-trung-ma', 'tham-tu-lung-danh-conan-ngoi-sao-5-canh-1-trieu-do',
    ]

    useEffect(() => {
        const fetchFixedMovies = async () => {
            setIsLoading(true)
            try {
                const fetchedMoviesPromises = fixedSlugs.map(async (slug) => {
                    const res = await fetch(`https://phimapi.com/phim/${slug}`)
                    if (!res.ok) return null;
                    const data = await res.json()
                    return data.status && data.movie ? data.movie : null
                });
                const fetchedMovies = await Promise.all(fetchedMoviesPromises)
                setMovies(fetchedMovies.filter((m): m is Movie => m !== null))
            } catch (error) {
                console.error("Lỗi khi fetch phim:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFixedMovies()
    }, [])

    if (isLoading) {
        return <BannerSkeleton />
    }
    
    return (
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] text-white">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                loop
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }} // Cho hiệu ứng fade mượt hơn
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full"
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie._id}>
                        {({ isActive }) => (
                            <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
                                <Image
                                    src={movie.poster_url || movie.thumb_url}
                                    alt={movie.name}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                {/* Lớp phủ gradient để làm nổi bật text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1]" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1]" />
                                
                                <SlideContent movie={movie} isActive={isActive} />
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail chọn phim */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
                <div className="flex gap-2.5 overflow-x-auto bg-black/40 p-2 rounded-xl backdrop-blur-sm scrollbar-hide max-w-full">
                    {movies.map((movie, index) => (
                        <button
                            key={movie._id}
                            onClick={() => swiperRef.current?.slideToLoop(index)}
                            className={`relative min-w-[80px] h-[45px] rounded-md cursor-pointer overflow-hidden border-2 transition-all duration-300 
                            ${index === activeIndex ? 'border-yellow-400 scale-110' : 'border-transparent hover:border-yellow-400 opacity-60 hover:opacity-100'}`}
                        >
                            <Image
                                src={movie.thumb_url}
                                alt={movie.name}
                                fill
                                sizes="(max-width: 768px) 10vw, 80px"
                                className="object-cover transition-transform duration-300"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    )
}