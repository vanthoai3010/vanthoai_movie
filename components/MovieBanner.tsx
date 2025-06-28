'use client'
import { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Heart, Calendar, Plus, Clock, Film, Star } from 'lucide-react'
import { Montserrat } from 'next/font/google'

// Import CSS cho Swiper
import 'swiper/css'
import 'swiper/css/effect-fade'

const montserrat = Montserrat({ subsets: ['latin'], weight: '800' })

// --- Interfaces ---
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
  <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-gradient-to-b from-gray-800 to-black animate-pulse overflow-hidden">
    <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-xl w-full">
        <div className="h-12 bg-gray-700 rounded mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded mb-8 w-1/2"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-8 bg-gray-700 rounded-full w-24"></div>
          <div className="h-8 bg-gray-700 rounded-full w-24"></div>
          <div className="h-8 bg-gray-700 rounded-full w-24"></div>
        </div>
        <div className="h-20 bg-gray-700 rounded mb-8"></div>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>

    {/* Thumbnail Skeleton */}
    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
      <div className="flex gap-2 bg-black/20 p-2 rounded-xl backdrop-blur-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[80px] h-[45px] bg-gray-700 rounded-md" />
        ))}
      </div>
    </div>
  </div>
)

// --- Component con cho nội dung của từng Slide ---
const SlideContent = ({ movie, isActive }: { movie: Movie; isActive: boolean }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        transition: { duration: 5, ease: 'easeInOut' } // dùng chuỗi
      }
    },
  }

  return (
    <motion.div
      className="relative z-10 h-full flex items-end md:items-center justify-center md:justify-start px-4 md:px-12 lg:px-24 pb-28 md:pb-0"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
    >
      <div className="max-w-xl mt-30 text-center md:text-left">
        {/* Rating Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-1.5 rounded-full"
        >
          <Star size={18} className="fill-white" />
          <span className="font-bold">9.5/10</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className={`${montserrat.className} text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 leading-tight text-white drop-shadow-lg`}
        >
          <Link href={`/xem-phim/${movie.slug}`} className="hover:text-yellow-400 transition-colors">
            {movie.name}
          </Link>
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="text-lg md:text-xl text-yellow-400 italic mb-4 font-medium"
        >
          {movie.origin_name}
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-sm mb-6"
        >
          <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Film size={16} className="text-yellow-400" />
            {movie.episode_current ? `${movie.episode_current}` : 'Hoàn thành'} ({movie.quality})
          </span>
          <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Clock size={16} className="text-yellow-400" /> {movie.time}
          </span>
          <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Calendar size={16} className="text-yellow-400" /> {movie.year}
          </span>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-slate-200 mb-8 line-clamp-3 leading-relaxed max-w-2xl"
        >
          {movie.content}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center md:justify-start gap-4"
        >
          <Link href={`/xem-phim/${movie.slug}`}>
            <button className="relative cursor-pointer w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black flex items-center justify-center shadow-lg hover:shadow-yellow-500/40 transition-all duration-300 group">
              <Play size={32} className="ml-1 fill-black" />
              <span className="absolute inset-0 border-2 border-yellow-500 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 pointer-events-none" />
            </button>
          </Link>

          <button className="w-12 h-12 cursor-pointer rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center group transition-all duration-300 backdrop-blur-sm shadow-lg">
            <Heart size={24} className="group-hover:fill-red-500 group-hover:stroke-red-500 transition-all" />
          </button>

          <button className="w-12 h-12 cursor-pointer rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center group transition-all duration-300 backdrop-blur-sm shadow-lg">
            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
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
    'tro-choi-con-muc-phan-3',
    'cung-dien-ma-am',
    'lanh-dia-tu-chien',
    'one-nguoi-hung-trung-hoc',
    'so-canh-sat-chicago-phan-11',
    'tham-tu-lung-danh-conan-25-nang-dau-halloween',
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
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] text-white overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        onSwiper={swiper => (swiperRef.current = swiper)}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie._id}>
            {({ isActive }) => (
              <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
                {/* Hiệu ứng Ken Burns (zoom chậm) */}
                <motion.div
                  className="absolute inset-0 z-0"
                  initial={{ scale: 1.15, opacity: 0.8 }}
                  animate={isActive ? { scale: 1, opacity: 1 } : { scale: 1.15, opacity: 0.8 }}
                  transition={{ duration: 8, ease: 'linear' }}
                >
                  <Image
                    src={movie.thumb_url}
                    alt={movie.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10 z-[1]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] z-[1]" />

                {/* Hiệu ứng ánh sáng */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-[1] pointer-events-none"
                  >
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
                    <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-20" />
                  </motion.div>
                )}

                <SlideContent movie={movie} isActive={isActive} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail chọn phim */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
        <div className="flex gap-2.5 overflow-x-auto bg-black/40 p-2 rounded-xl backdrop-blur-sm scrollbar-hide max-w-[90%]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 md:hidden">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-yellow-400 scale-125' : 'bg-white/50'
              }`}
          />
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { 
          height: 4px;
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .scrollbar-hide { 
          -ms-overflow-style: none; 
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  )
}