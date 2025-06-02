'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Genre {
  name: string;
  slug: string;
}

const colors = [
  'from-indigo-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-rose-500 to-red-500',
  'from-fuchsia-500 to-violet-500',
];

export default function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  const visibleGenres = genres.slice(0, 6);
  const hiddenGenres = genres.slice(6);

  const renderBox = (genre: Genre, index: number) => {
    const color = colors[index % colors.length];
    return (
      <Link key={genre.slug} href={`/the-loai/${genre.slug}`}>
        <div
          className={`bg-gradient-to-r ${color} hover:opacity-90 transition text-white rounded-lg p-4 h-[100px] shadow-md flex flex-col justify-center`}
        >
          <span className="font-bold text-lg">{genre.name}</span>
          <span className="text-sm mt-2">Xem chủ đề &rarr;</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-semibold text-white mb-5">Bạn đang quan tâm gì?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleGenres.map((genre, index) => renderBox(genre, index))}

        {!showAll && hiddenGenres.length > 0 && (

          <Link href="/the-loai" className="bg-gray-600 hover:bg-gray-500 transition cursor-pointer  text-white rounded-lg p-4 h-[100px] shadow-md flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setShowAll(false)}
            >
              <span className="font-bold text-lg cursor-pointer">+{hiddenGenres.length} chủ đề</span>
            </button>
          </Link>
        )}

        {showAll &&
          hiddenGenres.map((genre, index) =>
            renderBox(genre, index + visibleGenres.length)
          )}
      </div>
    </div>
  );
}
