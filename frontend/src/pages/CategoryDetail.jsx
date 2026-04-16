import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import VideoGrid from '@/components/VideoGrid';
import { getCategory, getVideos, getCategories, getSpeakers } from '@/lib/api';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, videosRes, categoriesRes, speakersRes] = await Promise.all([
          getCategory(id),
          getVideos({ category_id: id }),
          getCategories(),
          getSpeakers()
        ]);
        setCategory(categoryRes.data);
        setVideos(videosRes.data);
        setCategories(categoriesRes.data);
        setSpeakers(speakersRes.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="px-6 sm:px-12 lg:px-24 py-12">
          <div className="h-8 bg-gray-100 skeleton w-1/2 mb-4" />
          <div className="h-4 bg-gray-100 skeleton w-1/4" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Categoría no encontrada</h1>
          <Link to="/categories" className="text-sm underline">Volver a categorías</Link>
        </div>
      </div>
    );
  }

  const hasImage = !!category.image_url;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`relative flex items-end ${hasImage ? 'min-h-[40vh]' : 'border-b border-black/10'}`}>
        {hasImage ? (
          <>
            <div className="absolute inset-0">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
            <div className="relative z-10 w-full px-6 sm:px-12 lg:px-24 py-12">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                Volver a Categorías
              </Link>
              <span className="block text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
                {category.type === 'topic' ? 'Tema' : 'Serie'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-white/80 mt-4 max-w-2xl">{category.description}</p>
              )}
            </div>
          </>
        ) : (
          <div className="w-full px-6 sm:px-12 lg:px-24 py-12">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Volver a Categorías
            </Link>
            <span className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
              {category.type === 'topic' ? 'Tema' : 'Serie'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-gray-900">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 mt-4 max-w-2xl">{category.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
          {videos.length} {videos.length === 1 ? 'video' : 'videos'}
        </p>
        <VideoGrid
          videos={videos}
          categories={categories}
          speakers={speakers}
          showSpeaker
        />
      </div>
    </div>
  );
};

export default CategoryDetail;
