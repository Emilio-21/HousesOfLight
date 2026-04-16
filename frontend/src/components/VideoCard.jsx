import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from '@phosphor-icons/react';

const VideoCard = ({ video, showCategory = false, showSpeaker = false, category, speaker }) => {
  const defaultThumbnail = 'https://images.unsplash.com/photo-1615821430729-d3c98749eba4?w=800&h=450&fit=crop';
  
  return (
    <Link
      to={`/videos/${video.id}`}
      className="group block opacity-0 animate-fade-in"
      data-testid={`video-card-${video.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 mb-4 overflow-hidden">
        <img
          src={video.thumbnail_url || defaultThumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay — solo visible en hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={22} weight="fill" className="text-black ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
          {video.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} weight="bold" />
              {video.duration}
            </span>
          )}
          {video.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={12} weight="bold" />
              {video.views}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base lg:text-lg leading-tight group-hover:underline underline-offset-4">
          {video.title}
        </h3>

        {/* Category/Speaker */}
        {(showCategory && category) && (
          <p className="text-xs text-gray-500 uppercase tracking-widest">{category.name}</p>
        )}
        {(showSpeaker && speaker) && (
          <p className="text-xs text-gray-500 uppercase tracking-widest">{speaker.name}</p>
        )}

        {/* Description */}
        {video.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;
