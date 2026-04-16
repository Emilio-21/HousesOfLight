import { Link } from 'react-router-dom';

const SpeakerCard = ({ speaker }) => {
  const defaultImage = 'https://images.pexels.com/photos/8349232/pexels-photo-8349232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
  
  return (
    <Link
      to={`/speakers/${speaker.id}`}
      className="speaker-card block opacity-0 animate-fade-in"
      data-testid={`speaker-card-${speaker.id}`}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
        <img
          src={speaker.image_url || defaultImage}
          alt={speaker.name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
      </div>
      <h3 className="font-bold text-lg">{speaker.name}</h3>
      {speaker.bio && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{speaker.bio}</p>
      )}
    </Link>
  );
};

export default SpeakerCard;
