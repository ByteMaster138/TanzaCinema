import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Ticket, 
  CreditCard, 
  Calendar, 
  Bell, 
  Settings,
  LogOut, 
  Clock, 
  Star 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const { user, logout } = useAuth();
  const { bookings, getMovieById, getShowtimeById } = useMovies();
  const navigate = useNavigate();

  const userBookings = bookings.filter(booking => booking.userId === user?.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-xl text-gray-500">Please log in to view your profile</div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">My Bookings</h2>
            
            {userBookings.length > 0 ? (
              <div className="space-y-6">
                {userBookings.map(booking => {
                  const movie = getMovieById(booking.movieId);
                  const showtime = getShowtimeById(booking.showtimeId);
                  
                  if (!movie || !showtime) return null;
                  
                  return (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="md:flex">
                        <div className="md:flex-shrink-0">
                          <img 
                            className="h-48 w-full object-cover md:w-48" 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-purple-600 font-semibold mb-1">
                                {showtime.date} • {showtime.time}
                              </p>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
                              <div className="flex items-center text-sm text-gray-600 mb-4">
                                <Clock size={14} className="mr-1" />
                                <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                                <span className="mx-2">•</span>
                                <Star size={14} className="mr-1 text-amber-500" />
                                <span>{movie.rating}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.paymentStatus === 'completed' ? 'Paid' : booking.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                            </span>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4 mt-2">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Seats</span>
                              <span className="font-medium">
                                {booking.seats.map(seat => `${String.fromCharCode(64 + seat.row)}${seat.seatNumber}`).join(', ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Amount</span>
                              <span className="font-bold text-purple-700">
                                {new Intl.NumberFormat('en-TZ', {
                                  style: 'currency',
                                  currency: 'TZS',
                                  maximumFractionDigits: 0
                                }).format(booking.totalAmount)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-3">
                            <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                              Download Ticket
                            </button>
                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">My Profile</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                  <User size={40} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-gray-500 mb-4">{user.email}</p>
                  
                  <button className="text-sm text-purple-600 hover:text-purple-800">
                    Change profile picture
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+255 123 456 789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Preferences</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-lg mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive booking confirmations and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive text messages about your bookings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-gray-500">Receive offers, promotions, and news</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-lg mb-4">Display Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                      <option>English</option>
                      <option>Swahili</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                      <option>TZS (Tanzanian Shilling)</option>
                      <option>USD (US Dollar)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg">Saved Payment Methods</h3>
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  + Add New Method
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-amber-100 rounded flex items-center justify-center mr-4">
                      <span className="text-amber-800 font-bold text-xs">M-Pesa</span>
                    </div>
                    <div>
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-sm text-gray-500">+255 765 **** 325</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Added on {format(new Date(), 'MMM d, yyyy')}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Default
                    </span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 relative">
                  <div className="absolute top-4 right-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-red-100 rounded flex items-center justify-center mr-4">
                      <span className="text-red-800 font-bold text-xs">Airtel</span>
                    </div>
                    <div>
                      <p className="font-medium">Airtel Money</p>
                      <p className="text-sm text-gray-500">+255 678 **** 123</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Added on {format(new Date(), 'MMM d, yyyy')}</span>
                    <button className="text-xs text-purple-600 hover:text-purple-800">
                      Set as Default
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-lg mb-4">Payment History</h3>
                
                {userBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Movie
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBookings.map(booking => {
                          const movie = getMovieById(booking.movieId);
                          
                          return (
                            <tr key={booking.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {movie?.title}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {new Intl.NumberFormat('en-TZ', {
                                  style: 'currency',
                                  currency: 'TZS',
                                  maximumFractionDigits: 0
                                }).format(booking.totalAmount)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {booking.paymentMethod === 'mpesa' ? 'M-Pesa' : 
                                 booking.paymentMethod === 'tigopesa' ? 'Tigo Pesa' :
                                 booking.paymentMethod === 'airtelmoney' ? 'Airtel Money' :
                                 booking.paymentMethod === 'creditcard' ? 'Credit Card' : 'Bank Transfer'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.paymentStatus === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : booking.paymentStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {booking.paymentStatus === 'completed' ? 'Paid' : booking.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No payment history available.</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                
                {user.isAdmin && (
                  <span className="mt-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    Admin
                  </span>
                )}
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'bookings' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Ticket size={18} className="mr-3" />
                  My Bookings
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Profile Information
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'payment' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  Payment Methods
                </button>
                
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preferences' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  Preferences
                </button>
                
                {user.isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={18} className="mr-3" />
                    Admin Dashboard
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;