import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, featured = false }) => {
  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (featured) {
    return (
      <Link 
        to={`/movie/${movie.id}`} 
        className="relative overflow-hidden rounded-xl group h-[500px] w-full flex flex-col justify-end"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs font-medium">
              Featured
            </span>
            <div className="flex items-center text-amber-400">
              <Star size={16} className="fill-current" />
              <span className="ml-1 text-sm">{movie.rating}</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
          
          <div className="flex flex-wrap items-center text-sm text-gray-300 mb-3">
            <span className="mr-3 flex items-center">
              <Clock size={14} className="mr-1" />
              {formatDuration(movie.duration)}
            </span>
            <span className="mr-3">{movie.language}</span>
            <span>{movie.genre.join(', ')}</span>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-2">{movie.description}</p>
          
          <div className="inline-block bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 font-medium transition-colors">
            Book Tickets
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="card group transition-all hover:translate-y-[-5px]"
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex items-center bg-black/70 text-amber-400 px-2 py-0.5 rounded-md">
          <Star size={14} className="fill-current" />
          <span className="ml-1 text-xs">{movie.rating}</span>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock size={14} className="mr-1" />
          <span>{formatDuration(movie.duration)}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
        <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm font-medium">
          Book Tickets
        </button>
      </div>
    </Link>
  );
};

export default MovieCard;