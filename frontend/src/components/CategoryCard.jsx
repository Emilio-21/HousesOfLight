import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const CategoryCard = ({ category }) => {
  const defaultImage = 'https://images.pexels.com/photos/12454587/pexels-photo-12454587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
  
  return (
    <Link
      to={`/categories/${category.id}`}
      className="category-card block aspect-[4/3] opacity-0 animate-fade-in"
      data-testid={`category-card-${category.id}`}
    >
      <img
        src={category.image_url || defaultImage}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2 block">
          {category.type === 'topic' ? 'Tema' : 'Serie'}
        </span>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{category.name}</h3>
        <div className="flex items-center gap-2 text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Ver videos</span>
          <ArrowRight size={14} weight="bold" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
