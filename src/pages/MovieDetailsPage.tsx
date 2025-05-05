import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, CreditCard, Film, Plus, Play, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useMovies } from '../context/MoviesContext';
import { Movie, Showtime } from '../types';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById, getShowtimesByMovieId, movies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundMovie = getMovieById(id);
      if (foundMovie) {
        setMovie(foundMovie);
        document.title = `${foundMovie.title} - TanzaCinema`;
        
        // Get showtimes for this movie
        const movieShowtimes = getShowtimesByMovieId(id);
        setShowtimes(movieShowtimes);
        
        // If there are showtimes, select the first date by default
        if (movieShowtimes.length > 0) {
          setSelectedDate(movieShowtimes[0].date);
        }
        
        // Find similar movies based on genre
        if (foundMovie.genre.length > 0) {
          const similar = movies
            .filter(m => 
              m.id !== id && 
              m.genre.some(g => foundMovie.genre.includes(g))
            )
            .slice(0, 4);
          setSimilarMovies(similar);
        }
      }
    }

    // Cleanup
    return () => {
      document.title = 'TanzaCinema';
    };
  }, [id, getMovieById, getShowtimesByMovieId, movies]);

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get unique dates from showtimes
  const uniqueDates = Array.from(new Set(showtimes.map(s => s.date)))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d');
  };
  
  // Filter showtimes by selected date
  const filteredShowtimes = showtimes.filter(s => s.date === selectedDate);

  // Handle booking
  const handleBooking = (showtimeId: string) => {
    if (id) {
      navigate(`/seats/${id}/${showtimeId}`);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Movie Header with Backdrop */}
      <div 
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col md:flex-row items-end h-full pb-8">
            {/* Movie Poster */}
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl -mb-20 flex-shrink-0 border-4 border-white">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Movie Info */}
            <div className="md:ml-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4">
                <div className="flex items-center mr-4 text-amber-400">
                  <Star size={16} className="fill-current mr-1" />
                  <span>{movie.rating}/10</span>
                </div>
                <span className="mr-4 flex items-center">
                  <Clock size={14} className="mr-1" />
                  {formatDuration(movie.duration)}
                </span>
                <span className="mr-4">{movie.releaseDate.slice(0, 4)}</span>
                <span>{movie.language}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((genre, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-gray-800/80 text-gray-200 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => setIsTrailerPlaying(true)}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                <Play size={18} className="mr-2" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details and Booking */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            {/* Movie Synopsis */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-700 mb-6">{movie.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-500 font-medium">Director</h3>
                  <p className="text-gray-900">{movie.director}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-medium">Cast</h3>
                  <p className="text-gray-900">{movie.cast.join(', ')}</p>
                </div>
              </div>
            </div>
            
            {/* Showtimes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Calendar size={20} className="mr-2 text-purple-600" />
                Showtimes
              </h2>
              
              {showtimes.length > 0 ? (
                <>
                  {/* Date Selection */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {uniqueDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedDate === date 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Show Times for Selected Date */}
                  {filteredShowtimes.length > 0 ? (
                    <div className="space-y-4">
                      {filteredShowtimes.map(showtime => (
                        <div key={showtime.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Film size={16} className="text-purple-600 mr-2" />
                              <span className="font-medium">
                                Hall {showtime.hallId} - {showtime.time}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">
                                {new Intl.NumberFormat('en-TZ', {
                                  style: 'currency',
                                  currency: 'TZS',
                                  maximumFractionDigits: 0
                                }).format(showtime.price)}
                              </span>
                              <span className="mx-1">|</span>
                              <span className="font-semibold text-amber-600">
                                {showtime.vipPrice && new Intl.NumberFormat('en-TZ', {
                                  style: 'currency',
                                  currency: 'TZS',
                                  maximumFractionDigits: 0
                                }).format(showtime.vipPrice)} (VIP)
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleBooking(showtime.id)}
                            className="w-full mt-2 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium transition-colors"
                          >
                            <CreditCard size={16} className="mr-2" />
                            Book Tickets
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No showtimes available for the selected date.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No showtimes available for this movie.
                </p>
              )}
            </div>
          </div>
          
          <div className="md:w-1/3">
            {/* Similar Movies */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Similar Movies</h2>
                <a href="#" className="text-purple-600 hover:text-purple-800 flex items-center text-sm">
                  More <ChevronRight size={16} />
                </a>
              </div>
              
              <div className="space-y-4">
                {similarMovies.length > 0 ? (
                  similarMovies.map(similarMovie => (
                    <div 
                      key={similarMovie.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <img 
                        src={similarMovie.posterUrl} 
                        alt={similarMovie.title} 
                        className="w-14 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{similarMovie.title}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">{similarMovie.rating} ★</span>
                          <span>{formatDuration(similarMovie.duration)}</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/movie/${similarMovie.id}`)}
                          className="text-xs text-purple-600 mt-1 hover:text-purple-800"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    No similar movies found.
                  </p>
                )}
              </div>
            </div>
            
            {/* Add to Watchlist */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center mb-4">
                <Plus size={24} className="mr-2" />
                <h2 className="text-xl font-bold">My Watchlist</h2>
              </div>
              <p className="mb-4">
                Save this movie to your watchlist and get notified when it's available for streaming.
              </p>
              <button className="w-full bg-white text-purple-800 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      {isTrailerPlaying && movie.trailerUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsTrailerPlaying(false)}
        >
          <div className="relative w-full max-w-4xl">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setIsTrailerPlaying(false)}
            >
              <X size={24} />
            </button>
            <div className="aspect-video">
              <iframe
                src={`${movie.trailerUrl}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;