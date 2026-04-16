import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import VideoGrid from '@/components/VideoGrid';
import { getSpeaker, getVideos, getCategories, getSpeakers } from '@/lib/api';

const SpeakerDetail = () => {
  const { id } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [speakerRes, videosRes, categoriesRes, speakersRes] = await Promise.all([
          getSpeaker(id),
          getVideos({ speaker_id: id }),
          getCategories(),
          getSpeakers()
        ]);
        setSpeaker(speakerRes.data);
        setVideos(videosRes.data);
        setCategories(categoriesRes.data);
        setSpeakers(speakersRes.data);
      } catch (error) {
        console.error('Error fetching speaker:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" data-testid="speaker-detail-loading">
        <div className="px-6 sm:px-12 lg:px-24 py-12">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-gray-100 skeleton" />
            <div>
              <div className="h-8 bg-gray-100 skeleton w-48 mb-4" />
              <div className="h-4 bg-gray-100 skeleton w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="speaker-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Orador no encontrado</h1>
          <Link to="/speakers" className="text-sm underline">Volver a oradores</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="speaker-detail-page">
      {/* Header */}
      <div className="border-b border-black/10 py-12 px-6 sm:px-12 lg:px-24">
        <Link
          to="/speakers"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
          data-testid="back-to-speakers"
        >
          <ArrowLeft size={14} />
          Volver a Oradores
        </Link>

        <div className="flex flex-col sm:flex-row items-start gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={speaker.image_url || 'https://images.pexels.com/photos/8349232/pexels-photo-8349232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300'}
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Orador</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-4" data-testid="speaker-name">
              {speaker.name}
            </h1>
            {speaker.bio && (
              <p className="text-gray-600 max-w-2xl" data-testid="speaker-bio">
                {speaker.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-8" data-testid="videos-count">
          {videos.length} {videos.length === 1 ? 'video' : 'videos'}
        </p>
        <VideoGrid
          videos={videos}
          categories={categories}
          speakers={speakers}
          showCategory
        />
      </div>
    </div>
  );
};

export default SpeakerDetail;
