import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Film, Search, LogIn, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle transparency based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || isMenuOpen || location.pathname !== '/' 
      ? 'bg-white shadow-md text-gray-900' 
      : 'bg-gradient-to-b from-black/70 to-transparent text-white'
  }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Film size={28} className={`${isScrolled || isMenuOpen || location.pathname !== '/' ? 'text-purple-700' : 'text-amber-400'}`} />
            <span className="text-xl font-bold">TanzaCinema</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/movies" className="hover:text-purple-600 transition-colors">
              Movies
            </Link>
            {user && (
              <Link to="/profile" className="hover:text-purple-600 transition-colors">
                My Bookings
              </Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" className="hover:text-purple-600 transition-colors">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full text-sm bg-gray-100 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none w-44 transition-all"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            </form>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-purple-600 transition-colors">
                  <User size={20} />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-right">
                  <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link to="/profile/bookings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 hover:text-purple-600 transition-colors">
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center text-gray-700"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slideUp">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-gray-100 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="py-2 hover:text-purple-600" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/movies" className="py-2 hover:text-purple-600" onClick={closeMenu}>
                Movies
              </Link>
              {user && (
                <Link to="/profile" className="py-2 hover:text-purple-600" onClick={closeMenu}>
                  My Bookings
                </Link>
              )}
              {user?.isAdmin && (
                <Link to="/admin" className="py-2 hover:text-purple-600" onClick={closeMenu}>
                  Admin Panel
                </Link>
              )}
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-2">
                    <Link to="/profile" className="py-2 flex items-center space-x-2 hover:text-purple-600" onClick={closeMenu}>
                      <User size={18} />
                      <span>My Profile</span>
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="py-2 flex items-center space-x-2 hover:text-purple-600" onClick={closeMenu}>
                        <Settings size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full py-2 flex items-center space-x-2 text-red-600"
                    >
                      <LogIn size={18} className="transform rotate-180" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="py-2 flex items-center space-x-2 hover:text-purple-600" onClick={closeMenu}>
                  <LogIn size={18} />
                  <span>Login / Register</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;