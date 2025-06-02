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
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-gray-800 shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-black cursor-pointer transition"
            >
                ◀
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
                                        width={200}
                                        height={300}
                                        className="w-[200px] h-[300px] object-cover rounded-lg"
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
                                        <Link href={`/xem-phim/${movie.slug}`} className="flex-1">
                                            <button className="w-full px-5 py-1 cursor-pointer bg-yellow-500 text-black text-sm rounded hover:bg-yellow-400">
                                                ▶ Xem ngay
                                            </button>
                                        </Link>

                                        <button className="z px-1 py-1 cursor-pointer bg-gray-500 text-white text-sm rounded hover:bg-gray-400">
                                            🤍 Thích
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
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-gray-800 shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer hover:bg-black transition"
            >
                ▶
            </button>
        </div>
    );
}
