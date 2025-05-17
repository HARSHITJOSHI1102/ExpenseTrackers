import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? 'bg-blue-700' : '';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-blue-800 text-white">
        <div className="p-4 text-xl font-bold border-b border-blue-700">
          ExpenseTracker
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-blue-700 ${isActive(
                '/dashboard'
              )}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-blue-700 ${isActive(
                '/expenses'
              )}`}
            >
              <ListOrdered className="mr-3 h-5 w-5" />
              Expenses
            </Link>
            <Link
              to="/expenses/add"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-blue-700 ${isActive(
                '/expenses/add'
              )}`}
            >
              <PlusCircle className="mr-3 h-5 w-5" />
              Add Expense
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {currentUser?.name || 'User'}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center text-xs text-blue-300 hover:text-white mt-1"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden bg-blue-800 text-white">
          <div className="flex items-center justify-between p-4">
            <div className="font-bold text-lg">ExpenseTracker</div>
            <button onClick={toggleMobileMenu} className="p-1">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive(
                  '/dashboard'
                )}`}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive(
                  '/expenses'
                )}`}
                onClick={closeMobileMenu}
              >
                Expenses
              </Link>
              <Link
                to="/expenses/add"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive(
                  '/expenses/add'
                )}`}
                onClick={closeMobileMenu}
              >
                Add Expense
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
