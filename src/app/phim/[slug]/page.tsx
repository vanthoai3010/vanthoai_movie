'use client'
import { useSearchParams, useParams, notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Play, 
  Heart, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle,
  ThumbsUp,
  Send,
  Bookmark
} from 'lucide-react'

interface Episode {
  name: string
  link_embed: string
}

interface Server {
  server_name: string
  server_data: Episode[]
}

interface MovieData {
  movie: { 
    name: string
    poster_url?: string
    description?: string
    year?: string | number
    country?: string | string[]
    category?: Array<string | {id: string, name: string, slug: string}>
    director?: Array<string | {id: string, name: string, slug: string}>
    actor?: Array<string | {id: string, name: string, slug: string}>
    time?: string
    episode_current?: string
    episode_total?: string
    quality?: string
    lang?: string
    imdb?: { rating?: string }
  }
  episodes: Server[]
}

interface Comment {
  id: string
  user: string
  avatar: string
  content: string
  time: string
  likes: number
  replies?: Comment[]
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
  
  const slug = params?.slug as string
  const ss = parseInt(searchParams?.get('ss') || '1')
  const ep = parseInt(searchParams?.get('ep') || '1')
  
  const [data, setData] = useState<MovieData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: 'Phim hay quá! Diễn xuất tuyệt vời và cốt truyện hấp dẫn.',
      time: '2 giờ trước',
      likes: 12,
      replies: []
    },
    {
      id: '2',
      user: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'Chất lượng video rất tốt, cảm ơn admin!',
      time: '5 giờ trước',
      likes: 8,
      replies: []
    }
  ])

  useEffect(() => {
    if (slug) {
      fetchMovie(slug)
        .then((result) => setData(result))
        .finally(() => setLoading(false))
    }
  }, [slug])

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'Bạn',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
        content: newComment,
        time: 'Vừa xong',
        likes: 0,
        replies: []
      }
      setComments([comment, ...comments])
      setNewComment('')
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  if (loading) return <LoadingSpinner />

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header with movie info */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${data.movie.poster_url || 'https://images.unsplash.com/photo-1489599904064-49e163023ad1?w=1200&h=400&fit=crop'})`
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-20 container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <img 
                src={data.movie.poster_url || 'https://images.unsplash.com/photo-1489599904064-49e163023ad1?w=300&h=450&fit=crop'}
                alt={data.movie.name}
                className="w-32 md:w-48 h-48 md:h-72 object-cover rounded-lg shadow-2xl border-2 border-white/20"
              />
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{data.movie.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-300 mb-4">
                  {data.movie.year && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {data.movie.year}
                    </span>
                  )}
                  {data.movie.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {data.movie.time}
                    </span>
                  )}
                  {data.movie.quality && (
                    <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                      {data.movie.quality}
                    </span>
                  )}
                  {data.movie.imdb?.rating && (
                    <span className="flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded text-xs">
                      <Star className="w-3 h-3" />
                      {data.movie.imdb.rating}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mb-4">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isLiked ? 'bg-red-600 text-white' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    Yêu thích
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isBookmarked ? 'bg-blue-600 text-white' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    Lưu
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Video Player */}
            <div className="relative">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video relative">
                  <iframe
                    src={selectedEpisode.link_embed}
                    className="w-full h-full"
                    allowFullScreen
                    title={`${data.movie.name} - Tập ${selectedEpisode.name}`}
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium">
                      Tập {selectedEpisode.name} - {server.server_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Navigation */}
            <div className="space-y-6">
              {data.episodes.map((serverItem, sIndex) => (
                <div key={sIndex} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    Server {sIndex + 1}: {serverItem.server_name}
                  </h2>
                  <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-2">
                    {serverItem.server_data.map((epItem, eIndex) => (
                      <a
                        key={eIndex}
                        href={`/xem-phim/${slug}?ss=${sIndex + 1}&ep=${eIndex + 1}`}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          ss === sIndex + 1 && ep === eIndex + 1
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white'
                        }`}
                      >
                        {epItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                Bình luận ({comments.length})
              </h2>

              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-700/30 rounded-lg">
                    <img 
                      src={comment.avatar}
                      alt={comment.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{comment.user}</span>
                        <span className="text-xs text-gray-400">{comment.time}</span>
                      </div>
                      <p className="text-gray-300 mb-2">{comment.content}</p>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Movie Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Thông tin phim</h3>
              <div className="space-y-3 text-sm">
                {data.movie.episode_current && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tập hiện tại:</span>
                    <span className="text-white">{data.movie.episode_current}</span>
                  </div>
                )}
                {data.movie.episode_total && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tổng số tập:</span>
                    <span className="text-white">{data.movie.episode_total}</span>
                  </div>
                )}
                {data.movie.country && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white">
                      {Array.isArray(data.movie.country) 
                        ? data.movie.country.map(c => typeof c === 'object' ? c.name || c.slug : c).join(', ')
                        : typeof data.movie.country === 'object' 
                        ? data.movie.country.name || data.movie.country.slug || JSON.stringify(data.movie.country)
                        : data.movie.country
                      }
                    </span>
                  </div>
                )}
                {data.movie.lang && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ngôn ngữ:</span>
                    <span className="text-white">{data.movie.lang}</span>
                  </div>
                )}
                {data.movie.director && Array.isArray(data.movie.director) && (
                  <div>
                    <span className="text-gray-400 block mb-1">Đạo diễn:</span>
                    <span className="text-white">
                      {data.movie.director.map(d => typeof d === 'object' ? d.name || d.slug : d).join(', ')}
                    </span>
                  </div>
                )}
                {data.movie.actor && Array.isArray(data.movie.actor) && (
                  <div>
                    <span className="text-gray-400 block mb-1">Diễn viên:</span>
                    <span className="text-white">
                      {data.movie.actor.slice(0, 3).map(a => typeof a === 'object' ? a.name || a.slug : a).join(', ')}
                    </span>
                  </div>
                )}
                {data.movie.category && Array.isArray(data.movie.category) && (
                  <div>
                    <span className="text-gray-400 block mb-2">Thể loại:</span>
                    <div className="flex flex-wrap gap-1">
                      {data.movie.category.map((cat, index) => (
                        <span key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-md text-xs">
                          {typeof cat === 'object' ? cat.name || cat.slug || JSON.stringify(cat) : cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {data.movie.description && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Nội dung:</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {data.movie.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}