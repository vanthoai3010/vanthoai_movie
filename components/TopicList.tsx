'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Genre {
  name: string;
  slug: string;
}

const colors = [
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-blue-500 via-cyan-500 to-green-500',
  'from-rose-500 via-red-500 to-amber-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-sky-500 via-blue-500 to-indigo-500',
  'from-lime-500 via-green-500 to-emerald-500',
];

export default function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('https://phimapi.com/the-loai');
        const data = await res.json();
        setGenres(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thể loại:', error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  const visibleGenres = showAll ? genres : genres.slice(0, 8);

  const renderBox = (genre: Genre, index: number) => {
    const color = colors[index % colors.length];
    return (
      <Link 
        key={genre.slug} 
        href={`/the-loai/${genre.slug}`}
        className="relative group"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div
          className={`bg-gradient-to-r ${color} rounded-xl p-5 h-[120px] shadow-lg flex flex-col justify-between 
          transition-all duration-300 transform ${hoveredIndex === index ? 'scale-[1.03] shadow-xl' : 'scale-100'}`}
        >
          <span className="font-bold text-lg text-white drop-shadow-md">{genre.name}</span>
          <div className="flex justify-between items-end">
            <span className="text-sm text-white/80 font-medium">Khám phá</span>
            <span className="text-white text-xl transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </div>
        </div>
        <div 
          className={`absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 -z-10 ${hoveredIndex === index ? 'opacity-100' : ''}`}
        />
      </Link>
    );
  };

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Thể loại phim
          </span>
        </h2>
        {!showAll && genres.length > 8 && (
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all
            backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {visibleGenres.map((genre, index) => renderBox(genre, index))}
      </div>

      {showAll && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(false)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white 
            hover:from-gray-500 hover:to-gray-600 transition-all shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Thu gọn</span>
          </button>
        </div>
      )}
    </section>
  );
}