import dynamic from 'next/dynamic'
import MovieBanner from '@/components/MovieBanner';
import HomeSlider from '@/components/HomeSlider';
import TopicList from '@/components/TopicList';
import MovieSection from '@/components/MovieSection';
import { fetchMoviesByNation } from '@/lib/api';
import Top10Series from '@/components/Top10Series';
import AnimeSection from '@/components/AnimeMovie';

// Import component loading bằng `dynamic` để đảm bảo chạy ở client
import GlobalLoading from '@/components/GlobalLoading' // Thêm dòng này

export default async function HomePage() {
  await Promise.all([
    fetchMoviesByNation('han-quoc'),
    fetchMoviesByNation('trung-quoc'),
    fetchMoviesByNation('au-my')
  ]);

  return (
    <GlobalLoading>
      <div>
        <MovieBanner />
      </div>
      <main className="p-6 relative">
        <TopicList />
        <hr className="my-8 border-gray-700" />

        <div>
          <h3 className="text-2xl font-bold mb-6">🎬 Phim mới cập nhật</h3>
        </div>
        <HomeSlider />
        <hr className="my-8 border-gray-700" />

        <div className="px-4 sm:px-8 py-8 bg-[#0f0f1a] text-white">
          <MovieSection nation={{ slug: 'han-quoc', name: 'Phim Hàn Quốc' }} />
          <MovieSection nation={{ slug: 'trung-quoc', name: 'Phim Trung Quốc' }} />
          <MovieSection nation={{ slug: 'au-my', name: 'Phim Âu Mỹ' }} />
        </div>

        <div className="px-4 sm:px-8 py-8 bg-[#0f0f1a] text-white">
          <Top10Series />
        </div>
        <hr className="my-8 border-gray-700" />
        <AnimeSection />
      </main>
    </GlobalLoading>
  );
}
