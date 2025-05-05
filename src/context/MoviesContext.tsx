import React, { createContext, useContext, useState } from 'react';
import { Movie, Showtime, Booking, Seat, Hall } from '../types';
import { 
  movies, 
  showtimes, 
  halls, 
  generateRandomOccupiedSeats,
  getMovieById,
  getShowtimesByMovieId,
  getHallById,
  getShowtimeById
} from '../data/moviesData';

interface MoviesContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  showtimes: Showtime[];
  halls: Hall[];
  bookings: Booking[];
  selectedSeats: Seat[];
  activeBooking: Booking | null;
  getMovieById: (id: string) => Movie | undefined;
  getShowtimesByMovieId: (movieId: string) => Showtime[];
  getHallById: (id: string) => Hall | undefined;
  getShowtimeById: (id: string) => Showtime | undefined;
  generateSeats: (hallId: string, showtimeId: string) => Seat[];
  toggleSeatSelection: (seat: Seat) => void;
  filterMovies: (searchTerm: string, genres?: string[]) => void;
  createBooking: (userId: string, movieId: string, showtimeId: string, seats: Seat[]) => Booking;
  completeBooking: (bookingId: string, paymentMethod: string) => boolean;
  resetSelectedSeats: () => void;
  setActiveBooking: (booking: Booking | null) => void;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
};

export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allMovies] = useState<Movie[]>(movies);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const [allShowtimes] = useState<Showtime[]>(showtimes);
  const [allHalls] = useState<Hall[]>(halls);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const filterMovies = (searchTerm: string, genres?: string[]) => {
    let filtered = [...allMovies];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        movie.genre.some(g => g.toLowerCase().includes(term)) ||
        movie.director.toLowerCase().includes(term) ||
        movie.cast.some(c => c.toLowerCase().includes(term))
      );
    }
    
    if (genres && genres.length > 0) {
      filtered = filtered.filter(movie => 
        movie.genre.some(g => genres.includes(g))
      );
    }
    
    setFilteredMovies(filtered);
  };

  const generateSeats = (hallId: string, showtimeId: string): Seat[] => {
    const hall = getHallById(hallId);
    if (!hall) return [];
    
    // Generate random occupied seats for demo purposes
    const occupiedSeats = generateRandomOccupiedSeats(hallId);
    
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seatNumber = 1; seatNumber <= hall.seatsPerRow; seatNumber++) {
        const isVip = hall.vipRows?.includes(row) || 
          hall.vipSeats?.some(vr => vr.row === row && vr.seats.includes(seatNumber));
          
        const isOccupied = occupiedSeats.some(
          s => s.row === row && s.seatNumber === seatNumber
        );
        
        seats.push({
          id: `${row}-${seatNumber}`,
          row,
          seatNumber,
          isVip,
          isOccupied,
          isSelected: false
        });
      }
    }
    
    return seats;
  };

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.isOccupied) return;
    
    setSelectedSeats(prevSeats => {
      // Check if seat is already selected
      const isSeatSelected = prevSeats.some(
        s => s.row === seat.row && s.seatNumber === seat.seatNumber
      );
      
      if (isSeatSelected) {
        // Remove seat from selection
        return prevSeats.filter(
          s => !(s.row === seat.row && s.seatNumber === seat.seatNumber)
        );
      } else {
        // Add seat to selection
        return [...prevSeats, { ...seat, isSelected: true }];
      }
    });
  };

  const resetSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const createBooking = (userId: string, movieId: string, showtimeId: string, seats: Seat[]): Booking => {
    const showtime = getShowtimeById(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }
    
    // Calculate total amount
    const regularSeats = seats.filter(seat => !seat.isVip).length;
    const vipSeats = seats.filter(seat => seat.isVip).length;
    
    const totalAmount = 
      (regularSeats * showtime.price) + 
      (vipSeats * (showtime.vipPrice || showtime.price * 1.5));
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId,
      movieId,
      showtimeId,
      seats: seats.map(seat => ({
        row: seat.row,
        seatNumber: seat.seatNumber,
        isVip: seat.isVip
      })),
      totalAmount,
      paymentMethod: 'mpesa', // Default, will be updated when payment is made
      paymentStatus: 'pending',
      bookingDate: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    setActiveBooking(newBooking);
    
    return newBooking;
  };

  const completeBooking = (bookingId: string, paymentMethod: string): boolean => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              paymentMethod: paymentMethod as any, 
              paymentStatus: 'completed' 
            } 
          : booking
      )
    );
    
    // Reset selected seats after booking is completed
    resetSelectedSeats();
    
    return true;
  };

  return (
    <MoviesContext.Provider value={{
      movies: allMovies,
      filteredMovies,
      showtimes: allShowtimes,
      halls: allHalls,
      bookings,
      selectedSeats,
      activeBooking,
      getMovieById,
      getShowtimesByMovieId,
      getHallById,
      getShowtimeById,
      generateSeats,
      toggleSeatSelection,
      filterMovies,
      createBooking,
      completeBooking,
      resetSelectedSeats,
      setActiveBooking
    }}>
      {children}
    </MoviesContext.Provider>
  );
};