import VideoCard from './VideoCard';

const VideoGrid = ({ videos, categories = [], speakers = [], showCategory = false, showSpeaker = false }) => {
  const getCategoryById = (id) => categories.find(c => c.id === id);
  const getSpeakerById = (id) => speakers.find(s => s.id === id);

  if (!videos || videos.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-video-grid">
        <p className="text-gray-500 text-sm uppercase tracking-widest">No hay videos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="video-grid">
      {videos.map((video, index) => (
        <div key={video.id} className={`stagger-${(index % 6) + 1}`}>
          <VideoCard
            video={video}
            showCategory={showCategory}
            showSpeaker={showSpeaker}
            category={getCategoryById(video.category_id)}
            speaker={getSpeakerById(video.speaker_id)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
