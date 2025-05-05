import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';
import PaymentMethods from '../components/payment/PaymentMethods';
import { PaymentMethod } from '../types';

const PaymentPage: React.FC = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeBooking, getMovieById, getShowtimeById, completeBooking } = useMovies();
  const { user } = useAuth();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If no active booking or user, redirect to homepage
    if (!activeBooking || !user) {
      navigate('/');
    }
  }, [activeBooking, user, navigate]);

  if (!activeBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-xl text-gray-500">Booking not found</div>
      </div>
    );
  }

  const movie = getMovieById(activeBooking.movieId);
  const showtime = getShowtimeById(activeBooking.showtimeId);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setError('');
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      completeBooking(activeBooking.id, selectedPaymentMethod);
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

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
            Back to seat selection
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Payment Process Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className="w-full absolute top-1/2 h-0.5 bg-gray-200"></div>
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check size={18} />
                </div>
                <span className="text-sm font-medium mt-1">Select Movie</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Check size={18} />
                </div>
                <span className="text-sm font-medium mt-1">Select Seats</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isComplete 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white border-2 border-purple-600 text-purple-600'
                }`}>
                  {isComplete ? <Check size={18} /> : '3'}
                </div>
                <span className="text-sm font-medium mt-1">Payment</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  4
                </div>
                <span className="text-sm font-medium mt-1">Confirmation</span>
              </div>
            </div>
          </div>
          
          {isComplete ? (
            // Payment Success
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed. You will receive a confirmation email shortly.
              </p>
              <div className="p-4 border border-gray-200 rounded-lg mb-6 text-left">
                <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Movie:</div>
                  <div className="font-medium">{movie?.title}</div>
                  <div className="text-gray-500">Date & Time:</div>
                  <div className="font-medium">{showtime?.date} • {showtime?.time}</div>
                  <div className="text-gray-500">Seats:</div>
                  <div className="font-medium">
                    {activeBooking.seats.map(seat => `${String.fromCharCode(64 + seat.row)}${seat.seatNumber}`).join(', ')}
                  </div>
                  <div className="text-gray-500">Total Amount:</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat('en-TZ', {
                      style: 'currency',
                      currency: 'TZS',
                      maximumFractionDigits: 0
                    }).format(activeBooking.totalAmount)}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  View My Bookings
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            // Payment Form
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Complete Your Payment</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-gray-600">Movie:</div>
                    <div className="font-medium">{movie?.title}</div>
                    <div className="text-gray-600">Date & Time:</div>
                    <div className="font-medium">{showtime?.date} • {showtime?.time}</div>
                    <div className="text-gray-600">Selected Seats:</div>
                    <div className="font-medium">
                      {activeBooking.seats.map(seat => `${String.fromCharCode(64 + seat.row)}${seat.seatNumber}`).join(', ')}
                    </div>
                    <div className="text-gray-600">Total Amount:</div>
                    <div className="font-semibold text-purple-700">
                      {new Intl.NumberFormat('en-TZ', {
                        style: 'currency',
                        currency: 'TZS',
                        maximumFractionDigits: 0
                      }).format(activeBooking.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods Component */}
              <div className="mb-8">
                <PaymentMethods 
                  onSelectPaymentMethod={handlePaymentSelect}
                  totalAmount={activeBooking.totalAmount}
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
                  <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              <button 
                onClick={handlePayment}
                disabled={isProcessing || !selectedPaymentMethod}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ${new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                    maximumFractionDigits: 0
                  }).format(activeBooking.totalAmount)}`
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;