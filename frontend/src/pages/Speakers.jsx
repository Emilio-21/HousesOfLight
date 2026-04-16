import { useState, useEffect } from 'react';
import SpeakerCard from '@/components/SpeakerCard';
import { getSpeakers } from '@/lib/api';

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await getSpeakers();
        setSpeakers(response.data);
      } catch (error) {
        console.error('Error fetching speakers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeakers();
  }, []);

  return (
    <div className="min-h-screen" data-testid="speakers-page">
      {/* Header */}
      <div className="border-b border-black/10 py-12 px-6 sm:px-12 lg:px-24">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Conoce a Nuestros</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">Oradores</h1>
      </div>

      {/* Speakers Grid */}
      <div className="py-12 px-6 sm:px-12 lg:px-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-100 skeleton" />
                <div className="h-4 bg-gray-100 skeleton w-3/4" />
              </div>
            ))}
          </div>
        ) : speakers.length > 0 ? (
          <>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-8" data-testid="speakers-count">
              {speakers.length} {speakers.length === 1 ? 'orador' : 'oradores'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {speakers.map((speaker, index) => (
                <div key={speaker.id} className={`stagger-${(index % 6) + 1}`}>
                  <SpeakerCard speaker={speaker} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state" data-testid="empty-speakers">
            <p className="text-gray-500 text-sm uppercase tracking-widest">No hay oradores disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Speakers;
