const BASE_URL = 'https://phimapi.com';

type Movie = {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  origin_name: string;
  episode_current: string;
  // Bạn có thể mở rộng thêm nếu cần
};

/**
 * Fetch danh sách phim mới cập nhật
 */
export async function fetchOphimMovies(page: number = 1, limit: number = 20): Promise<Movie[]> {
  try {
    const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return Array.isArray(data.items) ? data.items.slice(0, limit) : [];
  } catch (error) {
    console.error('Error fetching phim mới cập nhật:', error);
    return [];
  }
}

/**
 * Fetch phim theo quốc gia
 */
export async function fetchMoviesByNation(slug: string, limit: number = 20): Promise<Movie[]> {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/quoc-gia/${slug}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data.data?.items || [];
  } catch (error) {
    console.error(`Error fetching phim quốc gia (${slug}):`, error);
    return [];
  }
}
/* phim hoat hinh */

export async function fetchMovieAnime(page: number = 1, limit: number = 20): Promise<Movie[]> {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/danh-sach/hoat-hinh?page=${page}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data.data?.items ? data.data.items.slice(0, limit) : [];
  } catch (error) {
    console.error('Error fetching phim hoạt hình:', error);
    return [];
  }
}