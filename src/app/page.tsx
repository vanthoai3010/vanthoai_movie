import MovieBanner from '@/components/MovieBanner';
import HomeSlider from '@/components/HomeSlider';
import TopicList from '@/components/TopicList';
import MovieSection from '@/components/MovieSection';
import { notFound } from 'next/navigation';
import { fetchMoviesByNation } from '@/lib/api'
import Top10Series from '@/components/Top10Series';




export default async function HomePage() {
  const [hanMovies, trungMovies, usMovies] = await Promise.all([
    fetchMoviesByNation('han-quoc'),
    fetchMoviesByNation('trung-quoc'),
    fetchMoviesByNation('au-my')
  ])
  return (
    <>
      <div>
        <MovieBanner />
      </div>
      <main className="p-6 relative">
        { /* chủ đề , thể loại */}
        <TopicList />
        <hr className="my-8 border-gray-700" />

        { /* Phim mới cập nhật */}
        <div>
          <h3 className="text-2xl font-bold mb-6">🎬 Phim mới cập nhật</h3>
        </div>
        <HomeSlider />
        <hr className="my-8 border-gray-700" />

        { /* Phim theo quốc gia */}
        <div className="px-4 sm:px-8 py-8 bg-[#0f0f1a] text-white">
          <MovieSection nation={{ slug: 'han-quoc', name: 'Phim Hàn Quốc' }} />
          <MovieSection nation={{ slug: 'trung-quoc', name: 'Phim Trung Quốc' }} />
          <MovieSection nation={{ slug: 'au-my', name: 'Phim Âu Mỹ' }} />
        </div>
        { /* top 10  Phim bộ mới */} 
        <div className="px-4 sm:px-8 py-8 bg-[#0f0f1a] text-white">
          <h2 className="text-2xl font-bold mb-6">📺 Top 10 phim bộ hôm nay</h2>
          <Top10Series />
        </div>
        <hr className="my-8 border-gray-700" />
      </main>
    </>
  );
}
