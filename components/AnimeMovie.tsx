"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchMovieAnime } from "@/lib/api";

export default function AnimeMovie() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnime = async () => {
            try {
                setLoading(true);
                const result = await fetchMovieAnime(1, 20);
                setMovies(result);
            } catch (error) {
                console.error("Failed to fetch anime movies:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAnime();
    }, []);

    return (
        <section className="px-4 md:px-8 lg:px-12 py-12 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            <span className="text-red-500">PHIM HOẠT HÌNH</span> MỚI NHẤT
                        </h2>
                        <p className="text-gray-400 mt-2">Khám phá thế giới anime đầy màu sắc</p>
                    </div>
                    <Link
                        href="/danh-sach/phim-hoat-hinh"
                        className="text-sm text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
                    >
                        Xem tất cả
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="relative">
                                <Skeleton height={320} borderRadius={12} className="w-full" />
                                <Skeleton height={20} className="mt-3 w-3/4" />
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
                        }}
                        navigation
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop
                        className="anime-swiper"
                    >
                        {movies.map((movie) => (
                            <SwiperSlide key={movie?._id}>
                                <div className="relative group h-full pb-8">
                                    {/* Anime Card */}
                                    <Link href={`/xem-phim/${movie.slug}`}>
                                        <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                            <Image
                                                src={`https://phimimg.com/${movie.poster_url || movie.thumb_url}`}
                                                alt={movie?.name || "Anime Poster"}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Episode Badge */}
                                            {movie.episode_current && (
                                                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                                    Tập {movie.episode_current}
                                                </div>
                                            )}

                                            {/* Hover Info */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition-all duration-300 z-10">
                                                <div className="flex space-x-2">

                                                    <button className="w-full cursor-pointer py-2 px-3 bg-white text-black text-sm font-semibold rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200">
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


                                                    <button className="p-2 cursor-pointer bg-gray-600/70 text-white rounded hover:bg-gray-500 transition-colors duration-200">
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

                                    {/* Title Below */}
                                    <Link href={`/xem-phim/${movie.slug}`}>
                                        <h3 className="text-white text-sm md:text-base mt-3 font-semibold line-clamp-1 hover:text-yellow-400 transition-colors">
                                            {movie?.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                        {movie?.origin_name}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            <style jsx global>{`
                .anime-swiper {
                    padding: 8px 0 24px;
                }
                
                .anime-swiper .swiper-slide {
                    transition: transform 0.3s ease;
                }
                
                .anime-swiper .swiper-slide:hover {
                    transform: scale(1.05) translateY(-8px);
                }
                
                .anime-swiper .swiper-button-next,
                .anime-swiper .swiper-button-prev {
                    width: 40px;
                    height: 40px;
                    background-color: rgba(229, 9, 20, 0.8);
                    color: white;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .anime-swiper .swiper-button-next:hover,
                .anime-swiper .swiper-button-prev:hover {
                    background-color: rgba(229, 9, 20, 1);
                    transform: scale(1.1);
                }
                
                .anime-swiper .swiper-button-next::after,
                .anime-swiper .swiper-button-prev::after {
                    font-size: 18px;
                    font-weight: bold;
                }
            `}</style>
        </section>
    );
}