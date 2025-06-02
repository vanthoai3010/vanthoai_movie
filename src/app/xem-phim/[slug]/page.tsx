'use client'

import { useSearchParams, useParams, notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Episode {
  name: string
  link_embed: string
}

interface Server {
  server_name: string
  server_data: Episode[]
}

interface MovieData {
  movie: { name: string }
  episodes: Server[]
}

async function fetchMovie(slug: string): Promise<MovieData | null> {
  try {
    const res = await fetch(`https://phimapi.com/phim/${slug}`)
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default function WatchPage() {
  const searchParams = useSearchParams()
  const params = useParams()

  const slug = params.slug as string
  const ss = parseInt(searchParams.get('ss') || '1')
  const ep = parseInt(searchParams.get('ep') || '1')

  const [data, setData] = useState<MovieData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchMovie(slug)
        .then((result) => setData(result))
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) return <LoadingSpinner />

  // Nếu không có dữ liệu hoặc không có danh sách tập
  if (!data || !data.episodes || data.episodes.length === 0) {
    notFound()
  }

  const server = data.episodes[ss - 1]
  const episodes = server?.server_data || []
  const selectedEpisode = episodes[ep - 1]

  if (!selectedEpisode) {
    notFound()
  }

  return (
    <main className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 mt-20">{data.movie.name}</h1>

      {/* Video player */}
      <div className="w-full bg-black flex justify-center">
        <div className="w-full max-w-[1800px] aspect-video">
          <iframe
            src={selectedEpisode.link_embed}
            allowFullScreen
            className="w-full h-full rounded"
          />
        </div>
      </div>

      {/* Server và danh sách tập */}
      <div className="space-y-6">
        {data.episodes.map((server, sIndex) => (
          <div key={sIndex}>
            <h2 className="text-lg font-semibold mb-2">
              Server {sIndex + 1}: {server.server_name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {server.server_data.map((epItem, eIndex) => (
                <a
                  key={eIndex}
                  href={`/xem-phim/${slug}?ss=${sIndex + 1}&ep=${eIndex + 1}`}
                  className={`px-3 py-1 rounded border text-sm ${ss === sIndex + 1 && ep === eIndex + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  Tập {epItem.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
