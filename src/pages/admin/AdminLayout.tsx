import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  CreditCard, 
  Calendar, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  TrendingUp, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-30 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <Film size={24} className="text-purple-600" />
              <span className="text-xl font-bold">TanzaAdmin</span>
            </Link>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto pt-4 pb-4">
            <ul className="space-y-1 px-2">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin') && !isActive('/admin/movies') && !isActive('/admin/bookings')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard size={18} className="mr-3" />
                  Dashboard
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/movies"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/movies')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Film size={18} className="mr-3" />
                  Movies
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/bookings"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/bookings')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  Bookings
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/showtimes"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/showtimes')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar size={18} className="mr-3" />
                  Showtimes
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/users')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users size={18} className="mr-3" />
                  Users
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/promotions"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/promotions')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp size={18} className="mr-3" />
                  Promotions
                </Link>
              </li>
              
              <li className="mt-6 px-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Settings
                </div>
              </li>
              
              <li>
                <Link
                  to="/admin/settings"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/settings')
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  System Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Sidebar Footer with User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mr-3">
                <span className="font-medium text-sm">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="bg-white shadow h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-4">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span className="mr-1">Help</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Documentation
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Support Center
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;