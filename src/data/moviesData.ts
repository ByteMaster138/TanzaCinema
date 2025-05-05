import { Movie, Showtime, Hall } from '../types';

export const movies: Movie[] = [
  {
    id: "1",
    title: "Wakanda Forever",
    posterUrl: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2022-11-11",
    duration: 161,
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 7.3,
    language: "English",
    description: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
    director: "Ryan Coogler",
    cast: ["Letitia Wright", "Lupita Nyong'o", "Danai Gurira", "Winston Duke"],
    trailerUrl: "https://www.youtube.com/watch?v=_Z3QKkl1WyM"
  },
  {
    id: "2",
    title: "A Quiet Place",
    posterUrl: "https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2018-04-06",
    duration: 90,
    genre: ["Horror", "Sci-Fi", "Thriller"],
    rating: 7.5,
    language: "English",
    description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    director: "John Krasinski",
    cast: ["Emily Blunt", "John Krasinski", "Millicent Simmonds", "Noah Jupe"]
  },
  {
    id: "3",
    title: "Inception",
    posterUrl: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2010-07-16",
    duration: 148,
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    language: "English",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"]
  },
  {
    id: "4",
    title: "The Dark Knight",
    posterUrl: "https://images.pexels.com/photos/534283/pexels-photo-534283.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/534283/pexels-photo-534283.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2008-07-18",
    duration: 152,
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    language: "English",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"]
  },
  {
    id: "5",
    title: "Parasite",
    posterUrl: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2019-05-30",
    duration: 132,
    genre: ["Comedy", "Drama", "Thriller"],
    rating: 8.6,
    language: "Korean",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"]
  },
  {
    id: "6",
    title: "Get Out",
    posterUrl: "https://images.pexels.com/photos/3062542/pexels-photo-3062542.jpeg?auto=compress&cs=tinysrgb&w=800",
    backdropUrl: "https://images.pexels.com/photos/3062542/pexels-photo-3062542.jpeg?auto=compress&cs=tinysrgb&w=1920",
    releaseDate: "2017-02-24",
    duration: 104,
    genre: ["Horror", "Mystery", "Thriller"],
    rating: 7.7,
    language: "English",
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    director: "Jordan Peele",
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford", "Catherine Keener"]
  }
];

export const halls: Hall[] = [
  {
    id: "1",
    name: "Main Hall",
    rows: 10,
    seatsPerRow: 16,
    vipRows: [1, 2],
    vipSeats: []
  },
  {
    id: "2",
    name: "VIP Hall",
    rows: 8,
    seatsPerRow: 12,
    vipRows: [1, 2, 3, 4],
    vipSeats: []
  },
  {
    id: "3",
    name: "IMAX Hall",
    rows: 12,
    seatsPerRow: 20,
    vipRows: [1, 2, 3],
    vipSeats: [
      { row: 4, seats: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
      { row: 5, seats: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }
    ]
  }
];

export const showtimes: Showtime[] = [
  {
    id: "1",
    movieId: "1",
    date: "2025-06-15",
    time: "18:30",
    hallId: "1",
    price: 15000,
    vipPrice: 25000
  },
  {
    id: "2",
    movieId: "1",
    date: "2025-06-15",
    time: "21:00",
    hallId: "2",
    price: 18000,
    vipPrice: 30000
  },
  {
    id: "3",
    movieId: "2",
    date: "2025-06-15",
    time: "19:00",
    hallId: "3",
    price: 20000,
    vipPrice: 35000
  },
  {
    id: "4",
    movieId: "3",
    date: "2025-06-16",
    time: "17:30",
    hallId: "1",
    price: 15000,
    vipPrice: 25000
  },
  {
    id: "5",
    movieId: "4",
    date: "2025-06-16",
    time: "20:00",
    hallId: "2",
    price: 18000,
    vipPrice: 30000
  },
  {
    id: "6",
    movieId: "5",
    date: "2025-06-17",
    time: "18:30",
    hallId: "3",
    price: 20000,
    vipPrice: 35000
  }
];

// Helper function to generate random occupied seats
export const generateRandomOccupiedSeats = (hallId: string, percentage: number = 0.3) => {
  const hall = halls.find(h => h.id === hallId);
  if (!hall) return [];
  
  const totalSeats = hall.rows * hall.seatsPerRow;
  const occupiedCount = Math.floor(totalSeats * percentage);
  const occupiedSeats = [];
  
  for (let i = 0; i < occupiedCount; i++) {
    const row = Math.floor(Math.random() * hall.rows) + 1;
    const seatNumber = Math.floor(Math.random() * hall.seatsPerRow) + 1;
    
    // Check if seat is already in the occupied list
    if (!occupiedSeats.some(s => s.row === row && s.seatNumber === seatNumber)) {
      const isVip = hall.vipRows?.includes(row) || 
        hall.vipSeats?.some(vr => vr.row === row && vr.seats.includes(seatNumber));
        
      occupiedSeats.push({
        row,
        seatNumber,
        isVip
      });
    }
  }
  
  return occupiedSeats;
};

// Function to find a movie by ID
export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

// Function to get showtimes for a movie
export const getShowtimesByMovieId = (movieId: string): Showtime[] => {
  return showtimes.filter(showtime => showtime.movieId === movieId);
};

// Function to find a hall by ID
export const getHallById = (id: string): Hall | undefined => {
  return halls.find(hall => hall.id === id);
};

// Function to get a showtime by ID
export const getShowtimeById = (id: string): Showtime | undefined => {
  return showtimes.find(showtime => showtime.id === id);
};