import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronRight } from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import MovieCard from '../components/movies/MovieCard';
import { Movie } from '../types';
import { format } from 'date-fns';

const HomePage: React.FC = () => {
  const { movies, filterMovies, filteredMovies } = useMovies();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get all unique genres from movies
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genre))
  ).sort();

  useEffect(() => {
    // Set a random featured movie on load
    const randomIndex = Math.floor(Math.random() * movies.length);
    setFeaturedMovie(movies[randomIndex]);
    
    // Check for search parameter in URL
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      filterMovies(searchQuery);
    }
  }, [movies, location.search, filterMovies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterMovies(searchTerm, selectedGenre ? [selectedGenre] : undefined);
    navigate(`/?search=${encodeURIComponent(searchTerm)}${selectedGenre ? `&genre=${encodeURIComponent(selectedGenre)}` : ''}`);
  };

  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      filterMovies(searchTerm);
    } else {
      setSelectedGenre(genre);
      filterMovies(searchTerm, [genre]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre(null);
    filterMovies('');
    navigate('/');
  };

  // Format today's date
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[85vh] bg-black">
        {featuredMovie && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${featuredMovie.backdropUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
            </div>
            <div className="container mx-auto px-4 h-full flex items-center pt-16">
              <div className="max-w-lg animate-fadeIn">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredMovie.title}</h1>
                <div className="flex flex-wrap items-center text-sm text-gray-300 mb-4">
                  <span className="mr-3">{featuredMovie.rating} ★</span>
                  <span className="mr-3">{featuredMovie.duration} mins</span>
                  <span>{featuredMovie.genre.join(', ')}</span>
                </div>
                <p className="text-gray-300 mb-6">{featuredMovie.description}</p>
                <button 
                  onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Filtering Section */}
      <section className="bg-white shadow-md py-6 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar size={20} className="text-purple-600 mr-2" />
              <span className="font-medium">{todayFormatted}</span>
            </div>
            
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative mr-3">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Search
              </button>
              {(searchTerm || selectedGenre) && (
                <button 
                  type="button"
                  onClick={clearFilters}
                  className="ml-2 text-gray-500 hover:text-purple-600 underline text-sm"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
          
          {/* Genre filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Now Showing</h2>
            <a href="#" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </a>
          </div>
          
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No movies found matching your criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-purple-600 hover:text-purple-800"
              >
                Clear filters and show all movies
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <a href="#" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </a>
          </div>
          
          {/* Featured Coming Soon Movie */}
          {featuredMovie && (
            <div className="mb-10">
              <MovieCard movie={featuredMovie} featured={true} />
            </div>
          )}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12 bg-purple-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Special Offers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-3">Student Discount</h3>
              <p className="mb-4">Show your student ID and get 20% off on any movie ticket on Mondays and Tuesdays!</p>
              <button className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors">
                Learn More
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-pink-800 to-purple-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-3">Family Package</h3>
              <p className="mb-4">Buy 4 tickets and get a free popcorn and drink combo. Perfect for family movie nights!</p>
              <button className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors">
                Learn More
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-3">VIP Membership</h3>
              <p className="mb-4">Join our VIP club and enjoy exclusive benefits, discounts and premiere invitations!</p>
              <button className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;