import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Users, Calendar, CreditCard, TrendingUp, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useMovies } from '../../context/MoviesContext';
import AdminLayout from './AdminLayout';

const AdminDashboardPage: React.FC = () => {
  const { movies, showtimes, bookings } = useMovies();
  
  // Calculate revenue
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'completed')
    .reduce((acc, booking) => acc + booking.totalAmount, 0);
  
  // Calculate tickets sold
  const ticketsSold = bookings
    .filter(booking => booking.paymentStatus === 'completed')
    .reduce((acc, booking) => acc + booking.seats.length, 0);
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Film className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Movies</p>
            <p className="text-2xl font-bold">{movies.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Showtimes</p>
            <p className="text-2xl font-bold">{showtimes.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('en-TZ', {
                style: 'currency',
                currency: 'TZS',
                maximumFractionDigits: 0
              }).format(totalRevenue)}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tickets Sold</p>
            <p className="text-2xl font-bold">{ticketsSold}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-purple-600 hover:text-purple-800">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Movie</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => {
                  const movie = movies.find(m => m.id === booking.movieId);
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium">{movie?.title || 'Unknown'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        User #{booking.userId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Intl.NumberFormat('en-TZ', {
                          style: 'currency',
                          currency: 'TZS',
                          maximumFractionDigits: 0
                        }).format(booking.totalAmount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popular Movies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Popular Movies</h2>
            <Link to="/admin/movies" className="text-sm text-purple-600 hover:text-purple-800">
              Manage Movies
            </Link>
          </div>
          
          <div className="space-y-4">
            {movies.slice(0, 5).map((movie, index) => (
              <div key={movie.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{movie.title}</p>
                  <p className="text-xs text-gray-500">{movie.genre.join(', ')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{movie.rating}</span>
                    <span className="text-xs ml-1">★</span>
                  </div>
                  <div className={`flex items-center text-xs ${
                    index % 2 === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {index % 2 === 0 ? (
                      <ArrowUp size={12} className="mr-0.5" />
                    ) : (
                      <ArrowDown size={12} className="mr-0.5" />
                    )}
                    <span>{Math.floor(Math.random() * 20) + 1}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/movies/new" 
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors"
          >
            <Film size={24} className="text-purple-600 mb-2" />
            <span className="font-medium">Add New Movie</span>
          </Link>
          
          <Link 
            to="/admin/showtimes/new" 
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors"
          >
            <Calendar size={24} className="text-blue-600 mb-2" />
            <span className="font-medium">Schedule Showtime</span>
          </Link>
          
          <Link 
            to="/admin/promotions" 
            className="bg-amber-50 hover:bg-amber-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors"
          >
            <TrendingUp size={24} className="text-amber-600 mb-2" />
            <span className="font-medium">Create Promotion</span>
          </Link>
          
          <Link 
            to="/admin/reports" 
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors"
          >
            <BarChart3 size={24} className="text-green-600 mb-2" />
            <span className="font-medium">View Reports</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;