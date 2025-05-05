import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Info } from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/seat/SeatGrid';
import { Movie, Showtime, Hall } from '../types';
import { format } from 'date-fns';

const SeatSelectionPage: React.FC = () => {
  const { id, showtime: showtimeId } = useParams<{ id: string; showtime: string }>();
  const navigate = useNavigate();
  const { 
    getMovieById, 
    getShowtimeById, 
    getHallById,
    selectedSeats,
    resetSelectedSeats,
    createBooking
  } = useMovies();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  
  useEffect(() => {
    if (id && showtimeId) {
      const foundMovie = getMovieById(id);
      if (foundMovie) {
        setMovie(foundMovie);
        
        const foundShowtime = getShowtimeById(showtimeId);
        if (foundShowtime) {
          setShowtime(foundShowtime);
          
          const foundHall = getHallById(foundShowtime.hallId);
          if (foundHall) {
            setHall(foundHall);
          }
        }
      }
    }
    
    // Reset selected seats when leaving the page
    return () => {
      resetSelectedSeats();
    };
  }, [id, showtimeId, getMovieById, getShowtimeById, getHallById, resetSelectedSeats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const calculateTotal = () => {
    if (!showtime) return 0;
    
    const regularSeats = selectedSeats.filter(seat => !seat.isVip).length;
    const vipSeats = selectedSeats.filter(seat => seat.isVip).length;
    
    return (regularSeats * showtime.price) + 
      (vipSeats * (showtime.vipPrice || showtime.price * 1.5));
  };

  const handleProceedToPayment = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { redirectTo: `/seats/${id}/${showtimeId}` } });
      return;
    }
    
    if (!id || !showtimeId) return;
    
    // Create booking in context
    const booking = createBooking(user.id, id, showtimeId, selectedSeats);
    
    // Navigate to payment page
    navigate(`/payment/${booking.id}`);
  };

  if (!movie || !showtime || !hall) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to movie
          </button>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-20 h-28 object-cover rounded-md mr-4 mb-3 md:mb-0"
            />
            <div>
              <h1 className="text-xl font-bold">{movie.title}</h1>
              <div className="text-sm text-gray-300">
                <p>{formatDate(showtime.date)} • {showtime.time}</p>
                <p>Hall {hall.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seat Selection */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Select Your Seats</h2>
          
          {/* Seat Grid Component */}
          <div className="mb-8">
            <SeatGrid hallId={hall.id} showtimeId={showtime.id} />
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start">
            <Info size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm">
                You can select multiple seats. VIP seats are highlighted in gold color. 
                You can click on a seat again to deselect it.
              </p>
            </div>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          
          <div className="divide-y divide-gray-200">
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">Movie</span>
              <span className="font-medium">{movie.title}</span>
            </div>
            
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{formatDate(showtime.date)} • {showtime.time}</span>
            </div>
            
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">Hall</span>
              <span className="font-medium">{hall.name}</span>
            </div>
            
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">Regular Seats</span>
              <span className="font-medium">
                {selectedSeats.filter(seat => !seat.isVip).length} x {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  maximumFractionDigits: 0
                }).format(showtime.price)}
              </span>
            </div>
            
            <div className="py-3 flex justify-between">
              <span className="text-gray-600">VIP Seats</span>
              <span className="font-medium">
                {selectedSeats.filter(seat => seat.isVip).length} x {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  maximumFractionDigits: 0
                }).format(showtime.vipPrice || showtime.price * 1.5)}
              </span>
            </div>
            
            <div className="py-4 flex justify-between">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-lg font-bold text-purple-700">
                {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  maximumFractionDigits: 0
                }).format(calculateTotal())}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
            className="w-full mt-6 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <CreditCard size={18} className="mr-2" />
            {selectedSeats.length === 0 ? 'Select Seats to Continue' : 'Proceed to Payment'}
          </button>
          
          {selectedSeats.length === 0 && (
            <p className="text-center text-sm text-red-500 mt-2">
              Please select at least one seat to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;