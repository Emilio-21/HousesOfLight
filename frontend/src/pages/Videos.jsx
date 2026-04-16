import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, Funnel, X } from '@phosphor-icons/react';
import VideoGrid from '@/components/VideoGrid';
import { getVideos, getCategories, getSpeakers } from '@/lib/api';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Videos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [speakerFilter, setSpeakerFilter] = useState(searchParams.get('speaker') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, speakersRes] = await Promise.all([
          getCategories(),
          getSpeakers()
        ]);
        setCategories(categoriesRes.data);
        setSpeakers(speakersRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (categoryFilter) params.category_id = categoryFilter;
        if (speakerFilter) params.speaker_id = speakerFilter;
        if (searchParams.get('featured') === 'true') params.featured = true;

        const response = await getVideos(params);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchVideos, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, categoryFilter, speakerFilter, searchParams]);

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSpeakerFilter('');
    setSearchParams({});
  };

  const hasActiveFilters = search || categoryFilter || speakerFilter;

  return (
    <div className="min-h-screen" data-testid="videos-page">
      {/* Header */}
      <div className="border-b border-black/10 py-12 px-6 sm:px-12 lg:px-24">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Explorar</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">Videos</h1>
      </div>

      {/* Search & Filters */}
      <div className="border-b border-black/10 py-6 px-6 sm:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-none border-black/20 focus:border-black"
              data-testid="search-input"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 h-12 px-6 border border-black/20 text-sm"
            data-testid="filter-toggle"
          >
            <Funnel size={18} />
            Filtros
          </button>

          {/* Filters (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] h-12 rounded-none border-black/20" data-testid="category-filter">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={speakerFilter} onValueChange={setSpeakerFilter}>
              <SelectTrigger className="w-[200px] h-12 rounded-none border-black/20" data-testid="speaker-filter">
                <SelectValue placeholder="Orador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los oradores</SelectItem>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker.id} value={speaker.id}>{speaker.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black"
                data-testid="clear-filters"
              >
                <X size={14} />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-black/10 space-y-4" data-testid="mobile-filters">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full h-12 rounded-none border-black/20">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={speakerFilter} onValueChange={setSpeakerFilter}>
              <SelectTrigger className="w-full h-12 rounded-none border-black/20">
                <SelectValue placeholder="Orador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los oradores</SelectItem>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker.id} value={speaker.id}>{speaker.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-3 text-xs uppercase tracking-widest text-gray-500 hover:text-black border border-black/10"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-100 skeleton" />
                <div className="h-4 bg-gray-100 skeleton w-3/4" />
                <div className="h-3 bg-gray-100 skeleton w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-8" data-testid="results-count">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} encontrados
            </p>
            <VideoGrid
              videos={videos}
              categories={categories}
              speakers={speakers}
              showCategory
              showSpeaker
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;
