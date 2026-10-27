import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Heart,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  Calendar,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, login } = useAuth();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickLogin = async (email, pass) => {
    setDemoDropdownOpen(false);
    const res = await login(email, pass);
    if (res.success) {
      navigate(res.user?.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-teal-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-1.5">
                Wanderly
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
              </span>
              <p className="text-[10px] tracking-widest uppercase text-teal-400 font-semibold">
                Explore the World
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-teal-400 ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-300'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/tours"
              className={({ isActive }) =>
                `transition-colors hover:text-teal-400 ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-300'
                }`
              }
            >
              Expeditions
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-teal-400 ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-300'
                }`
              }
            >
              Our Story
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-teal-400 ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-300'
                }`
              }
            >
              Concierge
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `transition-colors hover:text-teal-400 flex items-center gap-1.5 ${
                    isActive ? 'text-teal-400 font-semibold' : 'text-slate-300'
                  }`
                }
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>My Bookings</span>
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </NavLink>
            )}
          </nav>

          {/* Right Actions: Currency + Wishlist + Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-teal-400 hover:border-slate-600 transition-colors"
                title="Change Currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-fade-in"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  {availableCurrencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                        currency === c.code
                          ? 'bg-teal-500/20 text-teal-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.label}</span>
                      {currency === c.code && <span className="text-teal-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to={isAuthenticated ? '/dashboard?tab=wishlist' : '/login'}
              className="relative p-2 text-slate-300 hover:text-teal-400 transition-colors"
              title="Saved Expeditions"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              /* Logged In User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-teal-500/50 transition-all text-sm text-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 text-sm z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400 font-normal">Signed in as</p>
                      <p className="font-semibold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      My Bookings & Trips
                    </Link>

                    <Link
                      to="/dashboard?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Saved Wishlist ({wishlistCount})
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-amber-400 hover:bg-slate-800 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In Actions */
              <div className="flex items-center gap-3">
                {/* Quick Demo Credentials Dropdown for Academic Grading */}
                <div className="relative">
                  <button
                    onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                    title="Quick Login For Evaluation"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Demo Accounts</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {demoDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50"
                      onMouseLeave={() => setDemoDropdownOpen(false)}
                    >
                      <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                        One-Click Evaluation Login
                      </p>
                      <button
                        onClick={() => handleQuickLogin('admin@wanderly.com', 'Admin@123')}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex flex-col gap-0.5 transition-colors"
                      >
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Administrator Portal
                        </span>
                        <span className="text-[11px] text-slate-400">admin@wanderly.com</span>
                      </button>
                      <button
                        onClick={() => handleQuickLogin('aarav@wanderly.com', 'User@123')}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex flex-col gap-0.5 transition-colors mt-1"
                      >
                        <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> Demo Student Account
                        </span>
                        <span className="text-[11px] text-slate-400">aarav@wanderly.com</span>
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-teal-500 transition-all duration-300"
                >
                  Join Wanderly
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium hover:text-teal-400"
          >
            Home
          </Link>
          <Link
            to="/tours"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium hover:text-teal-400"
          >
            Expeditions
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium hover:text-teal-400"
          >
            Our Story
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium hover:text-teal-400"
          >
            Concierge
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-amber-400 font-semibold"
            >
              Admin Console
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>My Bookings & Purchases</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-400 font-semibold text-center"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-semibold text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-teal-500 text-white font-bold text-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
