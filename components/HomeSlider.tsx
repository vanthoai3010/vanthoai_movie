// components/HomeSlider.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchOphimMovies } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomeSlider() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: 'free-snap',
        slides: {
            origin: 'auto',
            perView: 'auto',
            spacing: 10,
        },
        breakpoints: {
            '(min-width: 768px)': {
                slides: {
                    perView: 'auto',
                    spacing: 20,
                },
            },
        },

    });

    useEffect(() => {
        const getMovies = async () => {
            const res = await fetchOphimMovies(1);
            setMovies(res || []);
            setLoading(false);
        };
        getMovies();
    }, []);

    // ✅ Loading UI thay vì return null
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <div className="relative">
            <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-white/20 backdrop-blur-md w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl text-white hover:scale-110 transition-all duration-300 shadow-xl"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>


            <div ref={sliderRef} className="keen-slider">
                {movies
                    .filter(movie => typeof movie.slug === 'string')
                    .map((movie) => (
                        <div
                            key={movie.slug}
                            className="keen-slider__slide relative group shrink-0 custom-slide"
                        >
                            <div className="relative w-[200px] h-[300px] overflow-hidden rounded-lg">
                                 <Link href={`/xem-phim/${movie.slug}`}>
                                    <Image
                                        src={`${movie.poster_url}`}
                                        alt={movie.name}
                                        width={220}
                                        height={330}
                                        className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                                        priority={false}
                                    />
                                </Link>
                                {/* Overlay hiển thị thông tin khi hover */
                                }
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 
    scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 
    transition duration-300 ease-out rounded-lg p-3 flex flex-col justify-end text-white z-10 shadow-lg"
                                >
                                    <Link href={`/xem-phim/${movie.slug}`}>
                                        <Image
                                            src={movie.poster_url}
                                            alt={movie.name}
                                            width={200}
                                            height={300}
                                            className="w-full h-full"
                                        />
                                    </Link>

                                    {/* Cặp button */}
                                    <div className="flex justify-between gap-2 mt-3">
                                       <Link 
                                            href={`/xem-phim/${movie.slug}`} 
                                            className="flex-1"
                                        >
                                            <button className="w-full py-1.5 px-3 cursor-pointer bg-white text-black text-xs md:text-sm font-semibold rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                Xem ngay
                                            </button>
                                        </Link>

                                          <button className="p-1.5 bg-gray-600/70 cursor-pointer text-white rounded-full hover:bg-gray-500 transition-colors duration-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Tiêu đề dưới ảnh */}
                            <Link href={`/xem-phim/${movie.slug}`}>
                                <h2 className="text-base text-sm text-center mt-5 line-clamp-2 max-w-[200px] hover:text-amber-400 transition-colors duration-200">
                                    {movie.name}
                                </h2>
                            </Link>
                            {/* Tên gốc dưới tiêu đề */}
                            <Link href={`/xem-phim/${movie.slug}`}>

                                <p className="text-xs text-gray-500 text-center mt-1 hover:text-amber-400 transition-colors duration-200">
                                    {movie.origin_name}
                                </p>
                            </Link>
                        </div>
                    ))}
            </div>

            <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-white/20 backdrop-blur-md w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl text-white hover:scale-110 transition-all duration-300 shadow-xl"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
