import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share, Calendar } from '@phosphor-icons/react';
import VideoGrid from '@/components/VideoGrid';
import { getVideo, getVideos, getCategory, getSpeaker, incrementView, getCategories, getSpeakers } from '@/lib/api';
import { toast } from 'sonner';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const videoRes = await getVideo(id);
        const videoData = videoRes.data;
        setVideo(videoData);

        // Increment view
        await incrementView(id);

        // Fetch category and speaker
        const promises = [];
        if (videoData.category_id) {
          promises.push(getCategory(videoData.category_id).then(res => setCategory(res.data)));
        }
        if (videoData.speaker_id) {
          promises.push(getSpeaker(videoData.speaker_id).then(res => setSpeaker(res.data)));
        }

        // Fetch related videos and filters
        promises.push(
          getVideos({ limit: 4 }).then(res => {
            setRelatedVideos(res.data.filter(v => v.id !== id).slice(0, 4));
          }),
          getCategories().then(res => setCategories(res.data)),
          getSpeakers().then(res => setSpeakers(res.data))
        );

        await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Error al cargar el video');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getEmbedUrl = (url, type) => {
    if (type === 'youtube') {
      // Extract YouTube video ID
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    if (type === 'vimeo') {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }
    return url;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" data-testid="video-detail-loading">
        <div className="px-6 sm:px-12 lg:px-24 py-12">
          <div className="aspect-video bg-gray-100 skeleton mb-8" />
          <div className="h-8 bg-gray-100 skeleton w-3/4 mb-4" />
          <div className="h-4 bg-gray-100 skeleton w-1/2" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="video-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Video no encontrado</h1>
          <Link to="/videos" className="text-sm underline">Volver a videos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="video-detail-page">
      {/* Breadcrumb */}
      <div className="border-b border-black/10 py-4 px-6 sm:px-12 lg:px-24">
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          data-testid="back-to-videos"
        >
          <ArrowLeft size={14} />
          Volver a Videos
        </Link>
      </div>

      {/* Video Player */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="video-player-container">
            {video.video_type === 'youtube' || video.video_type === 'vimeo' ? (
              <iframe
                src={getEmbedUrl(video.video_url, video.video_type)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-iframe"
              />
            ) : (
              <video
                src={video.video_url}
                controls
                className="w-full h-full"
                data-testid="video-player"
              >
                Tu navegador no soporta video.
              </video>
            )}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {category && (
              <Link
                to={`/categories/${category.id}`}
                className="text-xs uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-black/80 transition-colors"
                data-testid="video-category-link"
              >
                {category.name}
              </Link>
            )}
            {video.duration && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {video.duration}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Eye size={12} />
              {video.views} vistas
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              {new Date(video.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-6" data-testid="video-title">
            {video.title}
          </h1>

          {/* Speaker */}
          {speaker && (
            <Link
              to={`/speakers/${speaker.id}`}
              className="inline-flex items-center gap-3 mb-6 group"
              data-testid="video-speaker-link"
            >
              <div className="w-12 h-12 bg-gray-100 overflow-hidden">
                <img
                  src={speaker.image_url || 'https://images.pexels.com/photos/8349232/pexels-photo-8349232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100'}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Orador</p>
                <p className="font-bold group-hover:underline">{speaker.name}</p>
              </div>
            </Link>
          )}

          {/* Description */}
          {video.description && (
            <p className="text-gray-600 leading-relaxed mb-8" data-testid="video-description">
              {video.description}
            </p>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
            data-testid="share-button"
          >
            <Share size={14} />
            Compartir
          </button>
        </div>
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="py-12 px-6 sm:px-12 lg:px-24 border-t border-black/10">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-8">Más Videos</h2>
          <VideoGrid
            videos={relatedVideos}
            categories={categories}
            speakers={speakers}
            showCategory
            showSpeaker
          />
        </div>
      )}
    </div>
  );
};

export default VideoDetail;
