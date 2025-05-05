export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profileImageUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  duration: number; // minutes
  genre: string[];
  rating: number;
  language: string;
  description: string;
  director: string;
  cast: string[];
  trailerUrl?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  hallId: string;
  price: number;
  vipPrice?: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  vipRows?: number[];
  vipSeats?: {
    row: number;
    seats: number[];
  }[];
}

export interface Seat {
  id: string;
  row: number;
  seatNumber: number;
  isVip: boolean;
  isOccupied: boolean;
  isSelected: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  seats: {
    row: number;
    seatNumber: number;
    isVip: boolean;
  }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
}

export type PaymentMethod = 
  | 'mpesa' 
  | 'tigopesa' 
  | 'airtelmoney' 
  | 'creditcard' 
  | 'banktransfer';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'booking' | 'offer' | 'reminder';
  isRead: boolean;
  createdAt: string;
}